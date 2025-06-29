/**
|--------------------------------------------------
| Project: API Monitoring with Raw Node.js
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
const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('./route/routes');
const {notFoundHandler} = require('./handlers/routerHandlers/notFoundHandler');

// application object
const app = {};

// Configuration
app.config = {
  port: 3000,
  envName: 'development',
}

// Create server
app.createServer = () => {
  const server = http.createServer((req, res) => {
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

    chosenHandler(requestProperties, (statusCode, payload) => {
      // Use the status code returned by the handler or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload returned by the handler or default to an empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert payload to a string
      const payloadString = JSON.stringify(payload);

      // Set the response headers
    //   res.setHeader('Content-Type', 'application/json');
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
        //response end
        res.end("Hello from the server!");
    });
    
    
  });

  // Start the server
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
}

// Run the application
app.createServer();