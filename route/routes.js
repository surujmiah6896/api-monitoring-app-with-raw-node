/**
|--------------------------------------------------
| Title: Routes for API Monitoring
| Description: Application routes for handling API requests.
| Author: Md. Suruj Miah
| Email:surujmiah6896@gmail.com
| License: MIT
| Version: 1.0.0
| Last Updated: 29/5/2025
|--------------------------------------------------
*/
// Dependencies
const { homeHandler } = require("../handlers/routerHandlers/homeHandler");
const { userHandler } = require("../handlers/routerHandlers/userHandler");
const { tokenHandler } = require('../handlers/routerHandlers/tokenHandler');

const routes = {
    home: homeHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
