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
const {validationResult, body, query} = require('express-validator');
const v = require('validator');

// Importing the custom libs
const utils = require('../utils/index');
const model = require('../db/index');
const algo = require('../algo');

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
const advancedController = {
    /**
     * @function
     * Constructor  
     * This is the constructor function to set up all the controllers and api endpoints for the advanced module
     * 
     * @param {express_app_obj} app the express app object, kinda like the server obj
     * 
     */
    init(app){
        // Bulk Insert API
        /**
         * @API
         * POST /advance/insert
         * 
         * This is the advanced problem bulk insert API
         * As for this request, refer to api.md for more deatils.
         * 
         * Expected a json object as part of the request
         * {
         *     data: [
         *         {
         *          taskId, projectId, duration
         *         }
         *     ],
         * }
         * 
         */
        app.post('/advance/insert', [
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
            body('data.*.duration').exists()
                .isDecimal()
                .custom((value) => {return parseFloat(value) >= configs.durationMin;})
        ], function(req, res){
            // Check the validation
            const validationError = validationResult(req);
            if(!validationError.isEmpty()){
                res.status(400).send({
                    'error': 'Invalid data format',
                    'code': 400
                });
                return;
            }
            const parsedTasks = utils.dbParser.advanced.bulkInsert(req.body.data);
            new Promise((resolve) => {
                resolve(
                    model.advanced.insertTask(parsedTasks)
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
        app.get('/advance/data', [
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
                res.status(400).send({
                    'error': 'Wrong syntax for query params',
                    'code': 400
                });
                return;
            }
            const queryConditions = utils.dbParser.all.getDataQueryParams(req.query);
            new Promise((resolve) => {
                resolve(
                    model.advanced.getData(queryConditions)
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
                    // Refer to docs for what each object in the pgRes arr are
                    const parsedResult = utils.dataParser.advanced.getData(pgRes, req.query.pageNum || 10);
                    res.status(200).send({
                        'result': parsedResult
                    });
                }
            )
            .catch(
                function(err){
                    // For debugging err in api chain
                    return;
                }
            );
        });
        app.get('/advance/result', [
            query('projectId').exists()
                .isInt({min: configs.idMin, max: configs.idMax})
        ], function(req, res){
            // Check the validation
            const validationError = validationResult(req);
            if(!validationError.isEmpty()){
                res.status(400).send({
                    'error': 'Wrong syntax for query params',
                    'code': 400
                });
                return;
            }
            new Promise((resolve) => {
                resolve(
                    model.advanced.getResults(req.query.projectId)
                    .catch(
                        function(err){
                            // Process and send error response
                            if(err.code === 'PROID'){
                                // projectId not found
                                res.status(404).send({
                                    'error': 'ProjectId not found',
                                    'code': 404
                                });
                            }
                            else{
                                // If the db has an error
                                res.status(500).send({
                                    'error': 'Database error',
                                    'code': 500
                                });
                            }
                            throw err;
                        }
                    )
                );
            })
            .then(
                function(pgRes){
                    const tasks = pgRes.rows;
                    const results = algo.advanced.splitEqual.calculateResults(tasks);
                    const parsedResult = utils.dataParser.advanced.getEqualSplitResults(results);
                    res.status(200).send(parsedResult);
                }
            )
            .catch(
                function(err){
                    // Handle algo errors
                    if(err.name === 'ADVRESFLOAT'){
                        res.status(500).send({
                            'error': 'Project contain tasks with float duration',
                            'code': 500
                        });
                    }
                    // For debugging err in api chain
                    return;
                }
            );
        });
    }
};

module.exports = advancedController;