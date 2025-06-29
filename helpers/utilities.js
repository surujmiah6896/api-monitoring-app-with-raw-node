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


// Module dependencies
const utilities = {};
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
utilities.createHash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', environments[process.env.NODE_ENV].secretKry).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}