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
            const lateness = moment.duration(trueCurrentTime.diff(trueDueTime)).asHours().toFixed(3);
            // Placing in the additional information
            result['toDate'] = trueCurrentTime.format('YYYY/MM/DD');
            result['toTime'] = trueCurrentTime.format('HHmm');
            result['lateness'] = Math.max(0, lateness);
            // Pushing result into array
            results.push(result);

            // Updating the totalLateness
            totalLateness += Math.max(0, lateness);
        }
        return {
            'data': results,
            'totalLateness': totalLateness
        };
    },
};

module.exports = basicAlgo;