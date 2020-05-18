/**
 * @fileoverview 
 * This will be the file for the module containing the parser functions for parsing the data for output
 * 
 * @author Lim Chuan Hao
 * 
 */

/**
 * @class 
 * @module
 * The class/singleton/object/module for the dataParser
 * 
 */
const dataParser = {
    // Parsers to be used for the basic problem
    basic: {
        /**
         * @function
         * This parsing function is to parse the data to be sent for the get data api
         *
         * @param {Array} data The array of data from the get data model
         * task = {
         *      taskid: 6,
         *      duedate: '1998-02-01T16:00:00.000Z',
         *      duetime: '01:32:00',
         *      duration: 2,
         *      projectid: 11
         *  },
         * [
         * task, ...
         * ]
         * 
         * @returns {String} The query string to be passed down to the model to call for the data
         * Returns the same array with all the respective data parsed to be sent by the API
         * 
         */
        getData(data){
            for(let i=0; i<data.length; i++){
                // Getting the values
                let dueDate = `${data[i].duedate.getFullYear()}/${data[i].duedate.getMonth()}/${data[i].duedate.getDate()}`,
                dueTime = `${data[i].duetime}`;
                // Formatting and parsing them
                dueTime = dueTime.substring(0, 5);
                dueTime = dueTime.replace(':', '');
                // Setting values back
                data[i].duedate = dueDate;
                data[i].duetime = dueTime;
            }
            return data;
        },
    }
};

module.exports = dataParser;