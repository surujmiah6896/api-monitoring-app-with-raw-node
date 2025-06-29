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
const data = require('./lib/data');

// application object
const app = {};


data.create('test', 'newFile', { name: 'Suruj Miah', age: 28 }, (err) => {
  if (!err) {
    console.log('File created successfully');
  } else {
    console.error('Error creating file:', err);
  }
});

data.read('test', 'newFile', (err, data) => {
  if (!err && data) {
    console.log('File read successfully:', data);
  } else {
    console.error('Error reading file:', err);
  }
});

data.update('test', 'newFile', { name: 'Suruj Miah', age: 29 }, (err) => {
  if (!err) {
    console.log('File updated successfully');
  } else {
    console.error('Error updating file:', err);
  }
});

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