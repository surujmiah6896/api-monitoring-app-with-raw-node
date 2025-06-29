/**
|--------------------------------------------------
| Title: Utilities
| Description: Application Utilities 
| Author: Md. Suruj Miah
| Email: surujmiah6896@gmail.com
| Description: A simple Node.js application for monitoring APIs.
| License: MIT
|--------------------------------------------------
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/

// Create a module object
const utilities = {};

// Module dependencies
const crypto = require('crypto');
const environments = require('./environments');

// Parse JSON string to object
utilities.parseJsonToObject = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }

  return output;
}

//Create Hash 
utilities.Hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}

// create random string
utilities.createRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === 'number' && strlength > 0 ? strlength : false;

  if (length) {
      const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
      let output = '';
      for (let i = 1; i <= length; i += 1) {
          const randomCharacter = characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
          output += randomCharacter;
      }
      return output;
  }
  return false;
};


// Export the utilities module
module.exports = utilities;