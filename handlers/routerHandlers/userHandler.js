/**
|--------------------------------------------------
| Title: User Handler
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

handler.userHandler = (requestProperties, callback) => {
  const response = {
    message: 'The requested resource was User ',
    status: 'error',
  };

  // Check the request method
  if (requestProperties.method === 'get') {
    // Respond with a not found message
    callback(404, response);
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