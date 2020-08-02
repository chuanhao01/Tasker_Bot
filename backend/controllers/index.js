/**
 * @fileoverview 
 * This file will act as the interface for all the apis controllers, basic and advanced
 * 
 * @author Lim Chuan Hao
 * 
 * @requires ./controllers/basicController.js
 * @requires ./controllers/advancedController.js
 * 
 */

// Importing all the api endpoints modules
const basicController = require('./basicController');
const advancedController = require('./advancedController');

/**
 * This is the module that will hold all the controllers and run all the api endpoints for the server
 * @module
 * 
 */
const controllers = {
    /**
     * Constructor  
     * This is the constructor function to set up all the controllers and api endpoints
     * @function
     * 
     * @param {express_app_obj} pool the express app object, kinda like the server obj
     * 
     */
    init(app){
        // For the backend test runner to work
        app.get('/reset', function(req, res){
            const dbScripts = require('../scripts/dbScripts');
            const model = require('../db/index');
            new Promise((resolve) => {
                resolve(
                    dbScripts.dbInit(model.pool)
                );
            })
            .then(
                function(){
                    res.status(200).send({success: true});
                }
            )
            .catch(
                function(err){
                    res.status(500).send({error: err});
                }
            );
        });
        basicController.init(app);
        advancedController.init(app);
    }
};

module.exports = controllers;