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
const { verifyToken } = require('../../helpers/utilities');

// Module dependencies
const handle = {};