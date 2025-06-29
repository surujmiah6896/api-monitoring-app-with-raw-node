/**
|--------------------------------------------------
| Title: Token Handler
| Description: Application Token handle to related routes.
| Author: Md. Suruj Miah
| Email:surujmiah6896@gmail.com
| License: MIT
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/

// dependencies
const data = require('../../lib/data');
const { parseJsonToObject, Hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');

// Module dependencies
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ['post', 'get', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._tokens[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
}

handler._tokens = {};

// Tokens - post
handler._tokens.post = (requestProperties, callback) => {
  // Validate inputs
  const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone.trim() : false;
  const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password.trim() : false;

  if (phone && password) {
    // Lookup the user who matches that phone number
    data.read('users', phone, (err, userData) => {
      if (!err && userData) {
        // Hash the sent password and compare it to the password stored in the user object
        const hashedPassword = Hash(password);
        if (hashedPassword === userData.password) {
          // If valid, create a new token with a random name. Set expiration date 1 hour in the future.
          const tokenId = createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60; // 1 hour

          const tokenObject = {
            phone,
            id: tokenId,
            expires,
          };

          // Store the token
          data.create('tokens', tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { error: 'Could not create the new token' });
            }
          });
        } else {
          callback(400, { error: 'Password did not match' });
        }
      } else {
        callback(400, { error: 'Could not find the specified user' });
      }
    });
  } else {
    callback(400, { error: 'Missing required fields' });
  }
}

// Tokens - get
handler._tokens.get = (requestProperties, callback) => {
  // Check if the id is valid
  const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id.trim() : false;

  if (id) {
    // Lookup the token
    data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        // Remove the hashed password from the token object before returning it to the requester
        delete tokenData.password;
        callback(200, tokenData);
      } else {
        callback(404, { error: 'Token not found' });
      }
    });
  } else {
    callback(400, { error: 'Missing required field' });
  }
}