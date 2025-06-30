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
    ["get", "post", "put", "delete"].indexOf(requestProperties.body.method) > -1
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
    //lookup the user phone by reading the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = tokenData.phone;

        // Lookup the user data
        data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            console.log("token, userPhone", token, userPhone);

            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObject = parseJsonToObject(userData);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < 5) {
                  // Create a random id for the check
                  const checkId = createRandomString(20);
                  // Create the check object
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };
                  // Save the check object
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      // Add the check id to the user's checks
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      // Update the user data
                      data.update("users", userPhone, userObject, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            message: "Could not update the user",
                            status: "error",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        message: "Could not create the new check",
                        status: "error",
                      });
                    }
                  });
                } else {
                  callback(400, {
                    message: "User already has maximum number of checks (5)",
                    status: "error",
                  });
                }
              } else {
                callback(403, {
                  message: "Authentication failed",
                  status: "error",
                });
              }
            });
          } else {
            callback(404, {
              message: "User not found",
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

// Checks - get
handler._checks.get = (requestProperties, callback) => {
  // Check if the id is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id.trim()
      : false;

  if (id) {
    // Lookup the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        // Verify token
        const token =
          typeof requestProperties.headers.token === "string"
            ? requestProperties.headers.token
            : false;
        // token verification
        tokenHandler._token.verify(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              // Return the check data
              callback(200, checkData);
            } else {
              callback(403, {
                message: "Authentication failed",
                status: "error",
              });
            }
          }
        );
      } else {
        callback(404, { error: "Check not found" });
      }
    });
  } else {
    callback(400, { error: "Missing required field" });
  }
};

// Checks - put
handler._checks.put = (requestProperties, callback) => {
  // Validate inputs
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id.trim()
      : false;
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
    ["get", "post", "put", "delete"].indexOf(requestProperties.body.method) > -1
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

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup the check
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          // Verify token
          const token =
            typeof requestProperties.headers.token === "string"
              ? requestProperties.headers.token
              : false;
          // token verification
          tokenHandler._token.verify(
            token,
            checkData.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                // Update the check object
                if (protocol) {
                  checkData.protocol = protocol;
                }
                if (url) {
                  checkData.url = url;
                }
                if (method) {
                  checkData.method = method;
                }
                if (successCodes) {
                  checkData.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds;
                }
                // Store the updated check  
                data.update("checks", id, checkData, (err) => {
                  if (!err) {
                    callback(200, checkData);
                  } else {
                    callback(500, {
                      message: "Could not update the check",
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
            }
          );
        } else {
          callback(404, { error: "Check not found" });
        }
      });
    } else {
      callback(400, {
        message: "Missing required fields",
        status: "error",
      });
    }
  } else {
    callback(400, {
      message: "Missing required field",
      status: "error",
    });
  }
};

// Checks - delete
handler._checks.delete = (requestProperties, callback) => {
  // Check if the id is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id.trim()
      : false;

  if (id) {
    // Lookup the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        // Verify token
        const token =
          typeof requestProperties.headers.token === "string"
            ? requestProperties.headers.token
            : false;
        // token verification
        tokenHandler._token.verify(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              // Delete the check
              data.delete("checks", id, (err) => {
                if (!err) {
                    // Lookup the user to remove the check id from user's checks
                    data.read("users", checkData.userPhone, (err, userData) => {
                    if (!err && userData) {
                      const userObject = parseJsonToObject(userData);
                      const userChecks =
                        typeof userObject.checks === "object" &&
                        userObject.checks instanceof Array
                          ? userObject.checks
                          : [];
                      // Remove the check id from user's checks
                      const checkPosition = userChecks.indexOf(id);
                      if (checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);
                        // Update the user data
                        userObject.checks = userChecks;
                        data.update("users", checkData.userPhone, userObject, (err) => {
                          if (!err) {
                            callback(200, { message: "Check deleted successfully" });
                          } else {
                            callback(500, { error: "Could not update the user" });
                          }
                        });
                      } else {
                        callback(500, { error: "Check id not found in user's checks" });
                      }
                    } else {
                      callback(404, { error: "User not found" });
                    }
                  });
                } else {
                  callback(200, { message: "Check deleted successfully" });
                }
              });
            } else {
              callback(403, {
                message: "Authentication failed",
                status: "error",
              });
            }
          }
        );
      } else {
        callback(404, { error: "Check not found" });
      }
    });
  } else {
    callback(400, { error: "Missing required field" });
  }
};

//export the handler
module.exports = handler;
