/**
|--------------------------------------------------
| Project: Server
| Description: Server for API Monitoring with Raw Node.js
| Author: Md. Suruj Miah
| Email: surujmiah6896@gmail.com
| License: MIT
|--------------------------------------------------
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/


// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { parseJSONToObject } = require('./helpers/utilities');
const data = require('./data'); // Assuming you have a data module to handle checks

// application object
const worker = {};

//checks data 
worker.gatherAllChecks = () => {
    // Get all checks from the data store
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // Read the check data
                data.read('checks', check, (err, checkDataFiles) => {
                    if (!err && checkDataFiles) {
                      // Perform the check
                      worker.validateCheckData(
                        parseJSONToObject(checkDataFiles)
                      );
                    } else {
                      console.error(
                        `Error reading check data for ${check}:`,
                        err
                      );
                    }
                });
            });
        } else {
            console.error('Error retrieving checks:', err);
        }
    });
}


// Validate check data
worker.validateCheckData = (checkDataFiles) => {
    // Validate the check data structure
    if(checkDataFiles && checkDataFiles.id){
        checkDataFiles.state = typeof(checkDataFiles.state) === 'string' && ['up', 'down'].indexOf(checkDataFiles.state) > -1 ? checkDataFiles.state : 'down';
        checkDataFiles.lastChecked = typeof(checkDataFiles.lastChecked) === 'number' && checkDataFiles.lastChecked > 0 ? checkDataFiles.lastChecked : false;

        // Perform the check
        worker.performCheck(checkDataFiles);
    }else{
        console.log("Error: check was invalid or not properly formatted");
    }
   
}


// Perform the check
worker.performCheck = (checkDataFiles) => {
    //prepare the initial check outcome
    let checkOutcome = {
        error: false,
        responseCode: false
    };

    // mark the outcome as a failure
    let outcomeSent = false;

    // parse the hostname and path from the check data
    const parsedUrl = url.parse(checkDataFiles.protocol + '://' + checkDataFiles.url, true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path; // Using path instead of pathname to include query string if

    // Construct the request options
    const requestOptions = {
        protocol: checkDataFiles.protocol + ':',
        hostname: hostName,
        method: checkDataFiles.method.toUpperCase(),
        path,
        timeout: checkDataFiles.timeoutSeconds * 1000 // Convert seconds to milliseconds
    };

    const protocolToUse = checkDataFiles.protocol === 'http' ? http : https;

    // Create the request
    const req = protocolToUse.request(requestOptions, (res) => {
        
        checkOutcome.responseCode = res.statusCode;

        if(!outcomeSent){
            worker.processCheckOutcome(checkDataFiles, checkOutcome);
            outcomeSent = true;
        }
    });

    // Handle request errors
    req.on('error', (e) => {
        // Set the error in the check outcome
        checkOutcome.error = {
            error: true,
            value: e.message
        };

        if(!outcomeSent){
            worker.processCheckOutcome(checkDataFiles, checkOutcome);
            outcomeSent = true;
        }
    });

    // Handle request timeout
    req.on('timeout', () => {
        // Set the error in the check outcome
        checkOutcome.error = {
            error: true,
            value: 'timeout'
        };

        if(!outcomeSent){
            worker.processCheckOutcome(checkDataFiles, checkOutcome);
            outcomeSent = true;
        }
    });

    // End the request
    req.end();

}
//execute the worker process once per minute
worker.queue = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 60 * 1000);
}

// worker initialization
worker.init = () => {
    //execute all the checks immediately
    worker.gatherAllChecks();

    // Schedule the next execution
    worker.queue();
};

module.exports = worker;