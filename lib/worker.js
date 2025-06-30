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