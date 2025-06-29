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
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// application object
const app = {};

// Configuration
app.config = {
  port: 3000,
  envName: 'development',
}

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  // Start the server
  server.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
}

// Handle incoming requests and responses
app.handleReqRes = handleReqRes;

// Run the application
app.createServer();