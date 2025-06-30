/**
|--------------------------------------------------
| Title: Notification
| Description: implementation of notification system for API monitoring
| Author: Md. Suruj Miah
| Email: surujmiah6896@gmail.com
| Description: A simple Node.js application for monitoring APIs.
| License: MIT
|--------------------------------------------------
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/

//dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');

// Create a module object
const notification = {};

// Send SMS notification
notification.sendTwilioSms = (phone, msg, callback) => {
    // Validate parameters
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMeg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    
    if (userPhone && userMeg) {
      // Configure the request payload
      const payload = {
        From: twilio.fromPhone,
        To: `+88${phone}`,
        Body: userMeg,
      };

      // Stringify the payload
      const stringPayload = querystring.stringify(payload);

      // Configure the request details
      const requestDetails = {
        hostname: "api.twilio.com",
        method: "POST",
        path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
        auth: `${twilio.accountSid}:${twilio.authToken}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      // Create the request
      const req = https.request(requestDetails, (res) => {
        // Check if the request was successful
        const status = res.statusCode;
        if (status === 200 || status === 201) {
          callback(false);
        } else {
          callback(`Status code returned was ${status}`);
        }
      });

      // Handle any errors with the request
      req.on("error", (e) => {
        callback(`Error: ${e.message}`);
      });

      // Write the payload to the request body
      req.write(stringPayload);
      // End the request
      req.end();
    } else {
      callback("Given parameters were missing or invalid");
    }
}

// Export the module
module.exports = notification;