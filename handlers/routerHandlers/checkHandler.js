/**
|--------------------------------------------------
| Title: Check Handler
| Description: Checks info.
| Author: Md. Suruj Miah
| Email:surujmiah6896@gmail.com
| License: MIT
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/

//dependencies
const data = require("../../lib/data");
const { parseJsonToObject } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");


// module dependencies
const handler = {};


// checkHandler methods
handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._checks[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Method Not Allowed",
      status: "error",
    });
  }
};

// Container for all the checks methods
handler._checks = {};

// Checks - post
handler._checks.post = (requestProperties, callback) => {
  // Validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url.trim()
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(requestProperties.body.method) >
      -1
      ? requestProperties.body.method
      : false;
  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array &&
    requestProperties.body.successCodes.length > 0
      ? requestProperties.body.successCodes
      : false;
  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Verify token
    const token =
      typeof requestProperties.headers.token === "string"
        ? requestProperties.headers.token
        : false;

    tokenHandler._token.verify(token, (tokenId) => {
      if (tokenId) {
        // Lookup the user
        data.read("users", tokenId, (err, userData) => {
          if (!err && userData) {
            // Create a random id for the check
            const checkId = createRandomString(20);

            // Create the check object and include the user's phone number
            const checkObject = {
              id: checkId,
              userPhone: userData.phone,
              protocol,
              url,
              method,
              successCodes,
              timeoutSeconds,
            };

            // Store the check object
            data.create("checks", checkId, checkObject, (err) => {
              if (!err) {
                callback(200, checkObject);
              } else {
                callback(500, { error: "Could not create the new check" });
              }
            });
          } else {
            callback(403, {
              message: "Authentication failed",
              status: "error",
            });
          }
        });
      } else {
        callback(403, {
          message: "Authentication failed",
          status: "error",
        });
      }
    });
  } else {
    callback(400, {
      message: "Missing required fields",
      status: "error",
    });
  }
};


//export the handler
module.exports = handler;


