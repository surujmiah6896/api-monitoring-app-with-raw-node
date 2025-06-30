// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

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

// Read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
    if (!err && data) {
      const parsedData = JSON.parse(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
}

// Update data in a file
lib.update = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);
        // Truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
            if (!err) {
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
                callback('Error truncating the file');
            }
            }
        );
    } else {
      callback('Could not open the file for updating');
    }
  });
}   

// Delete a file
lib.delete = (dir, file, callback) => {
  // Unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting the file');
    }
  });
}


// List all files in a directory
lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir}${dir}/`, (err, files) => {
    if (!err && files && files.length > 0) {
      const trimmedFiles = files.map(file => file.replace('.json', ''));
      callback(false, trimmedFiles);
    } else {
      callback(err, files, {message:'Error reading directory or no files found'});
    }
  });
}

//export the module
module.exports = lib;