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
const data = require('../../lib/data');
const { parseJsonToObject} = require('../../helpers/utilities');
const { Hash} = require('../../helpers/utilities');

handler.userHandler = (requestProperties, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method Not Allowed',
            status: 'error',
        });
    }
};
 
// Container for all the users methods
handler._users = {};    

// Users - post
handler._users.post = (requestProperties, callback) => {
    // Validate the inputs
    console.log(`Request Body: ${JSON.stringify(requestProperties.body)}`);
    console.log(`Type of: ${requestProperties.body.firstName}`);
    
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName.trim() : false;
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone.trim() : false;
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password.trim() : false;
    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true ? true : false;
    console.log(`First Name: ${firstName}, Last Name: ${lastName}, Phone: ${phone}, Password: ${password}, TOS Agreement: ${tosAgreement}`);
    
    if(firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user does not already exist
        data.read('users', phone, (err, userData) => {
            if(err) {
                // Hash the password
                const hashedPassword = Hash(password);
                if(hashedPassword) {
                    // Create the user object
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        password: hashedPassword,
                        tosAgreement,
                    };
                    // Store the user
                    data.create('users', phone, userObject, (err) => {
                        if(!err) {
                            callback(200, {
                                message: 'User created successfully',
                                status: 'success',
                            });
                        } else {
                            callback(500, {
                                message: 'Could not create the user',
                                status: 'error',
                            });
                        }
                    });
                } else {
                    callback(500, {
                        message: 'Could not hash the user\'s password',
                        status: 'error',
                    });
                }
            } else {
                callback(400, {
                    message: 'User already exists',
                    status: 'error',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Invalid inputs',
            status: 'error',
        });
    }
};

// Export the handler
module.exports = handler;