/**
 * @fileoverview 
 * Contains the algo to calculate the advanced results
 * 
 * @author Lim Chuan Hao
 * 
 */

const advancedAlgo = {
    splitEqual:{
        calculateResults(tasks){

        },
        /**
         * @function
         * Helper funciton to abstract the knapsack algorithm from processing the results
         * 
         * Note: The algorithm used here is a recursive solution to the 0/1 knapsack problem 
         * Refer to docs for more information on the algorithm
         * 
         * @param {Array} tasks The array of tasks for the knapsack algo to solve
         * @param {Number} target The target number of hours each person should ideally do
         * 
         * @returns {Array} An array contain 0/1 for which person should take the task
         * 
         */
        customKnapsack(tasks, target){
            // Creating the 0/1 array to assign tasks to the person
            let personTasks = [];
            for(let task of tasks){
                personTasks.push(-1);
            }
            // Recursive function call to solve
            function rec(n, c){
                // Base case
                if(n === 0 || c === 0){
                    if(n > 0){
                        personTasks[n-1] = 0;
                    }
                    return 0;
                }
                // Rec, pushing factor
                if(tasks[n-1] < c){
                    personTasks[n-1] = 0;
                    return rec(n-1, c);
                }
                else{
                    const takeItem = tasks[n-1] + rec(n-1, c-tasks[n-1]);
                    const dontTakeItem = rec(n-1, c);
                    if(takeItem > dontTakeItem){
                        personTasks[n-1] = 1;
                    }
                    else{
                        personTasks[n-1] = 0;
                    }
                    return Math.max(takeItem, dontTakeItem);
                }
            }
            rec(tasks.length, target);
            return personTasks;
        }
    },
};

module.exports = advancedAlgo;