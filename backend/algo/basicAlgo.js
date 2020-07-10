/**
 * @fileoverview 
 * Contains the algo to calculate the basic results
 * 
 * @author Lim Chuan Hao
 * 
 * @requires moment
 * 
 */

// Importing libs needed
const moment = require('moment');

const basicAlgo = {
    /**
     * @function
     * The function to calculate the lateness based on the basic problem statement
     * 
     * @param {Array} tasks The array of tasks from the db model call
     * @param {String} startDate String of the Start Date (YYYY/MM/DD)
     * @param {String} startTime String of the Start Time (HHmm)
     * 
     * @returns {Object} A js object containing the calculated individual results for each tasks with the total lateness
     * {
     *  'data': Array,
     *  'totalLateness': Number
     * }
     * 
     */
    calculateResults(tasks, startDate, startTime){
        const trueCurrentTime = moment(`${startDate} ${startTime}`, 'YYYY/MM/DD HHmm');
        const results = [];
        let totalLateness = 0;
        for(let task of tasks){
            // Creating the result object
            let result = {
                'taskId': task.taskid,
                'fromDate': trueCurrentTime.format('YYYY/MM/DD'),
                'fromTime': trueCurrentTime.format('HHmm')
            };
            // Updating the current time to finish the task
            trueCurrentTime.add(task.duration, 'hours');
            // Calculating the true dueTime
            const trueDueTime = moment(`${task.duedate.format('YYYY/MM/DD')} ${task.duetime}`, 'YYYY/MM/DD HH:mm:ss');
            // Calculating lateness to 3dp
            let lateness = moment.duration(trueCurrentTime.diff(trueDueTime)).asHours();
            lateness = Math.max(0, lateness);
            // Placing in the additional information
            result['toDate'] = trueCurrentTime.format('YYYY/MM/DD');
            result['toTime'] = trueCurrentTime.format('HHmm');
            result['lateness'] = lateness;
            // Pushing result into array
            results.push(result);

            // Updating the totalLateness
            totalLateness += lateness;
        }
        return {
            'data': results,
            'totalLateness': totalLateness
        };
    },
};

module.exports = basicAlgo;