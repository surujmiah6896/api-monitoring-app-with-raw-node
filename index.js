/**
|--------------------------------------------------
| Project: API Monitoring with Raw Node.js
| Author: Md. Suruj Miah
| Email: surujmiah6896@gmail.com
| Description: A simple Node.js application for monitoring APIs.
| License: MIT
|--------------------------------------------------
| Version: 1.0.0
| Last Updated: 30/6/2025
|--------------------------------------------------
*/


// Dependencies
const http = require('http');
const server = require('./lib/server');
const worker = require('./lib/worker');


// application object
const app = {};

app.init = () => {
  // Create server
  server.createServer();

  // Initialize worker
  worker.init();
}

// Run the application
app.init(); 


// Export the app object for testing or other purposes
module.exports = app;