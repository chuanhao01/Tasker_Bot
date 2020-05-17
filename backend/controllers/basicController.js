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
const {check, validationResult, checkSchema, body, query} = require('express-validator');
const moment = require('moment');
const v = require('validator');

// Importing the custom libs
const utils = require('../utils/index');
const model = require('../db/index');

const configs = {
    idMin: 0,
    idMax: 9999999999,
    durationMin: 1,
};

/**
 * @module
 * The module holding all the controllers and api endpoints for the basic problem
 * 
 */
const basicController = {
    /**
     * @function
     * Constructor  
     * This is the constructor function to set up all the controllers and api endpoints for the basic module
     * 
     * @param {express_app_obj} app the express app object, kinda like the server obj
     * 
     */
    init(app){
        // Bulk Insert API
        /**
         * @API
         * This is the basic problem bulk insert API
         * As for this request, refer to api.md for more deatils.
         * 
         * Expected a json object as part of the request
         * {
         *     data: [
         *         {
         *          taskId, projectId, dueDate, dueTime, duration
         *         }
         *     ],
         * }
         * 
         */
        app.post('/basic/insert', [
            // Checking if the main data object exists in the request
            body('data').exists()
                .custom((value) => {return Array.isArray(value);})
                .custom((value) => {return value.length > 0;}),
            // Checking if all the taskId fields are within int
            body('data.*.taskId').exists()
                .isInt({min: configs.idMin, max: configs.idMax}),
            // Same for projectId
            body('data.*.projectId').exists()
                .isInt({min: configs.idMin, max: configs.idMax}),
            // Checking if date given is following format and is valid
            body('data.*.dueDate').exists()
                .custom((value) => {return /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}/g.test(value);})
                .custom((value) => {return moment(value, 'YYYY/MM/DD').isValid();}),
            // Checking if the time given 
            body('data.*.dueTime').exists()
                .custom((value) => {return !(value == '2400');})
                .custom((value) => {return moment(value, 'HHmm').isValid();}),
            body('data.*.duration').exists()
                .isInt({min: configs.durationMin}),
        ], function(req, res){
            // Check the validation
            const validationError = validationResult(req);
            if(!validationError.isEmpty()){
                // console.log(validationError.mapped());
                res.status(400).send({
                    'error': 'Invalid data format',
                    'code': 400
                });
                return;
            }
            const parsed_tasks = utils.dbParser.basic.bulkInsert(req.body.data);
            new Promise((resolve, reject) => {
                resolve(
                    model.basic.insertTask(parsed_tasks)
                    .catch(
                        function(err){
                            // Handle custom errors
                            if(err.code === '23505'){
                                // Duplicate entry error code
                                res.status(409).send({
                                    'error': 'Duplicate entries',
                                    'code': 409
                                });
                                throw(err);
                            }
                            // If the db has an error
                            res.status(500).send({
                                'error': 'Database error',
                                'code': 500
                            });
                            throw(err);
                        }
                    )
                );
            })
            .then(
                function(){
                    // If bulk insert of data is successful
                    res.status(200).send({
                        'result': 'success',
                    });
                }
            )
            .catch(
                function(err){
                    // For debugging err in api chain
                    // console.log(err);
                    return;
                }
            );
        });
        // Get basic data
        /**
         * @API
         * This is the basic problem get data API for the basic data viewer
         * As for this request, refer to api.md for more deatils.
         * 
         * Expected optional querys:
         * ?projectId[>]=Int&duration[<]=Int&sortBy=attribute.order,&page=Int&pageNum=Int
         * localhost:3000/basic/data?projectId[>]=1&duration[<=]=10&sortBy=projectId.asc,taskId.asc&page=2&pageNum=3
         * 
         */
        app.get('/basic/data',[
            query('projectId').optional()
                .custom((value) => {return Object.keys(value).length == 1;})
                .custom((value) => {return ['>', '<', '='].includes(Object.keys(value)[0]);})
                .custom((value) => {return Object.values(value).length == 1;})
                .custom((value) => {return Object.values(value)[0] != '';})
                .custom((value) => {return v.isInt(Object.values(value)[0], {min: configs.idMin, max: configs.idMax});}),
            query('duration').optional()
                .custom((value) => {return Object.keys(value).length == 1;})
                .custom((value) => {return ['>', '<', '=', '>=', '<='].includes(Object.keys(value)[0]);})
                .custom((value) => {return Object.values(value).length == 1;})
                .custom((value) => {return Object.values(value)[0] != '';})
                .custom((value) => {return v.isInt(Object.values(value)[0], {min: configs.durationMin});}),
            query('page').optional()
                .isInt({min: 1}),
            query('pageNum').optional()
                .isInt({min: 1}),
            query('sortBy').optional()
                .custom((value) => {return utils.v.basic.getSortByQuery(value);}),
        ], function(req, res){
            // Check the validation
            const validationError = validationResult(req);
            if(!validationError.isEmpty()){
                // console.log(validationError.mapped());
                res.status(400).send({
                    'error': 'Wrong syntax for query params',
                    'code': 400
                });
                return;
            }
            // Parse the query params to be used in the db call
            const queryConditions = utils.dbParser.all.getDataQueryParams(req.query);
            new Promise((resolve) => {
                resolve(
                    model.basic.getData(queryConditions)
                    .catch(
                        function(err){
                            // If the db has an error
                            res.status(500).send({
                                'error': 'Database error',
                                'code': 500
                            });
                            throw(err);
                        }
                    )
                );
            })
            .then(
                function(pgRes){
                    res.status(200).send({
                        'result': 'success',
                        'data': pgRes.rows,
                    });
                }
            )
            .catch(
                function(err){
                    // For debugging err in api chain
                    // console.log(err);
                    return;
                }
            );
        });
    }
};

module.exports = basicController;