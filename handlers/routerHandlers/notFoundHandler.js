/**
|--------------------------------------------------
| Title: Not Found Handler
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

handler.notFoundHandler = (requestProperties, callback) => {
  const response = {
    message: 'The requested resource was not found',
    status: 'error',
  };
  callback(404, response);
  
}

// Export the handler
module.exports = handler;