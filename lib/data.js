// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'w', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);
      
      // Write to the file
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing the file');
            }
          });
        } else {
          callback('Error writing to the file');
        }
      });
    } else {
      callback('Could not open the file for writing');
    }
  });
}