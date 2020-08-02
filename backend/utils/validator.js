/**
 * @fileoverview 
 * This will be the file for the custom module to validate the certain inputs for the controllers
 * 
 * @author Lim Chuan Hao
 * 
 */


/**
 * @class 
 * @module
 * The class/singleton/object/module for the custom validtor module
 * 
 */
const validator = {
    // The parser for the basic problem
    basic: {
        /**
         * @function
         * This validates and makes sure the query params for sortBy in the get data basic is validated
         * 
         * @param {String} queryParam the string value of the query param in the sortedBy query
         * 
         * @returns {Boolean} returns the boolean of whether the query param string is valid
         * 
         */
        getSortByQuery(queryParam){
            /*
            Basic Idea
            Since the query param can look like, projectId.asc,taskId.desc
            We check for every order in the list, if the 'attribute'.'order' are valid
            */
            const possibleAttributes = ['projectId', 'taskId', 'dueDate', 'dueTime', 'duration'];
            const possibleOrders = ['asc', 'desc'];
            try{
                const sortOrders = queryParam.split(',');
                if(sortOrders.length === 0){
                    return false;
                }
                for(let sortOrder of sortOrders){
                    const values = sortOrder.split('.');
                    if(values.length !== 2){
                        return false;
                    }
                    const attribute = values[0], order = values[1];
                    if(!possibleAttributes.includes(attribute)){
                        return false;
                    }
                    if(!possibleOrders.includes(order)){
                        return false;
                    }
                }
                return true;
            }
            catch(err){
                // If it fails in any of the splitting or functions
                return false;
            }
        }
    },
};

module.exports = validator;