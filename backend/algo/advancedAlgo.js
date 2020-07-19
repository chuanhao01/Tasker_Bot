/**
 * @fileoverview 
 * Contains the algo to calculate the advanced results
 * 
 * @author Lim Chuan Hao
 * 
 */

const advancedAlgo = {
    splitEqual:{
        /**
         * @function
         * Function to calculate the result for the advanced problem
         * 
         * @param {Array} tasks Array of tasks for the advanced problem
         * 
         * @returns {Array} An array of the tasks for the first and second person
         * [[tasks for first person], [tasks for the second person]]
         * 
         */
        calculateResults(tasks){
            // Calculate sum of duration to find split and find out if there are decimals
            let sum = 0;
            let includeFloats = false;
            for(let task of tasks){
                if(!Number.isSafeInteger(task.duration)){
                    includeFloats = true;
                }
                sum += task.duration;
            }
            // Get the task allocation based on algo
            let taskAllocation;
            if(includeFloats){
                taskAllocation = this.customKnapsackRec(task, sum/2);
            }
            // Tasks for each person to be returned
            let personTasks = [[], []];
            for(let i=0; i<taskAllocation.length; i++){
                personTasks[taskAllocation[i]].push(tasks[i]);
            }
            return personTasks;
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
        customKnapsackRec(tasks, target){
            // Creating the 0/1 array to assign tasks to the person
            let taskAllocation = [];
            for(let task of tasks){
                taskAllocation.push(-1);
            }
            // Recursive function call to solve
            function rec(n, c){
                // Base case
                if(n === 0 || c === 0){
                    if(n > 0){
                        taskAllocation[n-1] = 0;
                    }
                    return 0;
                }
                // Rec, pushing factor
                if(tasks[n-1] < c){
                    taskAllocation[n-1] = 0;
                    return rec(n-1, c);
                }
                else{
                    const takeItem = tasks[n-1] + rec(n-1, c-tasks[n-1]);
                    const dontTakeItem = rec(n-1, c);
                    if(takeItem > dontTakeItem){
                        taskAllocation[n-1] = 1;
                    }
                    else{
                        taskAllocation[n-1] = 0;
                    }
                    return Math.max(takeItem, dontTakeItem);
                }
            }
            rec(tasks.length, target);
            return taskAllocation;
        }
    },
};

module.exports = advancedAlgo;