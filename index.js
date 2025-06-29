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
    
    // Handle the request
    if (path === 'ping' && method === 'get') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'pong' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  // Start the server
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
}

// Run the application
app.createServer();