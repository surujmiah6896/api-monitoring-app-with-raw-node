
/**
|--------------------------------------------------
| Title: handleReqRes
| Description: Application routes for handling API requests.
| Author: Md. Suruj Miah
| Email: surujmiah6896@gmail.com
| Description: A simple Node.js application for monitoring APIs.
| License: MIT
|--------------------------------------------------
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/




// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../route/routes');
const { notFoundHandler } = require('../handlers/routerHandlers/notFoundHandler');
const { parseJsonToObject } = require('./utilities');

const handler = {};

handler.handleReqRes = (req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url, true);
    // Get the path and method
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;

    const requestProperties = {
        parsedUrl,
        path,
        method,
        queryStringObject,
        headers: req.headers,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[path] ? routes[path] : notFoundHandler;

    requestProperties.body = parseJsonToObject(realData);
    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};

        // Convert payload to a string
        const payloadString = JSON.stringify(payload);

        // Set the response headers
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);

        // Send the response
        res.end(payloadString);
    });

    // Collect the data from the request
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    // End the request
    req.on('end', () => {
        realData += decoder.end();

        console.log(realData);
        // response end
        res.end('Hello from the server!');
    });
};

// Export the handler
module.exports = handler;