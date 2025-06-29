/**
|--------------------------------------------------
| Title: Home Handler
| Description: Application routes for handling API requests.
| Author: Md. Suruj Miah
| Email:surujmiah6896@gmail.com
| License: MIT
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/

// module dependencies
const handler = {};

handler.homeHandler = (requestProperties, callback) => {
  const response = {
    message: 'Welcome to the API Monitoring Service',
    status: 'success',
  };

  // Check the request method
  if (requestProperties.method === 'get') {
    // Respond with a success message
    callback(200, response);
  } else {
    // Respond with a method not allowed error
    callback(405, {
      message: 'Method Not Allowed',
      status: 'error',
    });
  }
}

// Export the handler
module.exports = handler;