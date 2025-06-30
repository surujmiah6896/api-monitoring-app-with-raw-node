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
const { handleReqRes } = require('../helpers/handleReqRes');

// application object
const server = {};


// Configuration
server.config = {
  port: 3000,
};

// Create server
server.createServer = () => {
  const serverInstance = http.createServer(server.handleReqRes);
  // Start the server
  serverInstance.listen(server.config.port, () => {
    console.log(`Server is running on port ${server.config.port}`);
  });
};

// Handle incoming requests and responses
server.handleReqRes = handleReqRes;

// server initialization
server.init = () => {
  server.createServer();
}

module.exports = server;