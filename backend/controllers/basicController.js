/**
 * @fileoverview 
 * This file will contain all the api endpoints used for the basic requirement of the assignment
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:express-validator
 * @requires NPM:moment
 * 
 */

// Importing npm libs needed
const {check, validationResult, checkSchema, body} = require('express-validator');
const moment = require('moment');

/**
 * The module holding all the controllers and api endpoints for the basic problem
 * @module
 * 
 */
const basicController = {
    /**
     * Constructor  
     * This is the constructor function to set up all the controllers and api endpoints for the basic module
     * @function
     * 
     * @param {express_app_obj} pool the express app object, kinda like the server obj
     * 
     */
    init(app){
        app.post('/basic/insert', [
            // Checking if the main data object exists in the request
            body('data').exists(),
            // Checking if all the taskId fields are within int
            body('data.*.taskId').exists().isInt({min: 0, max: 9999999999}),
            // Same for projectId
            body('data.*.projectId').exists().isInt({min: 0, max: 9999999999}),
            // Checking if date given is following format and is valid
            body('data.*.dueDate').exists().custom((value) => {return /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}/g.test(value);}).custom((value) => {return moment(value, 'YYYY/MM/DD').isValid();}),
            // Checking if the time given 
            body('data.*.dueTime').exists().custom((value) => {return !(value == '2400');}).custom((value) => {return moment(value, 'HHmm').isValid();}),

        ], function(req, res){
            // Check the validation
            const validationError = validationResult(req);
            if(!validationError.isEmpty()){
                console.log(validationError.mapped());
                res.status(500).send({
                    'Error': 'error'
                });
                return;
            }
            res.send(req.body.data);
        });
    }
};

module.exports = basicController;