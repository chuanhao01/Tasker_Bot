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
            // Calculate sum of duration to find split, find out if there are decimals, and create the arrs of duration
            let sum = 0;
            let includeFloats = false;
            let tasksDuration = [];
            for(let task of tasks){
                if(!Number.isSafeInteger(task.duration)){
                    includeFloats = true;
                }
                sum += task.duration;
                tasksDuration.push(task.duration);
            }
            // Get the task allocation based on algo
            let tasksAllocation;
            if(includeFloats){
                // tasksAllocation = this.customKnapsackRec(tasksDuration, sum/2);
                // Throws an error if there is a float for now
                throw Error('Advanced Result should not have floats');
            }
            else{
                tasksAllocation = this.customKnapsackDPMem(tasksDuration, sum/2);
            }
            // Tasks for each person to be returned
            let personTasks = [[], []];
            for(let i=0; i<tasksAllocation.length; i++){
                // Taking the choosen task
                const choosenTask = tasks[i];
                const resultTask = {
                    'projectId': choosenTask['projectid'],
                    'taskId': choosenTask['taskid'],
                    'duration': choosenTask['duration']
                };
                // Place it for the 1st or 2nd person
                personTasks[tasksAllocation[i]].push(resultTask);
            }
            return personTasks;
        },
        /**
         * @function
         * Helper funciton to abstract the knapsack algorithm from processing the results
         * 
         * Note: The algorithm used here is a recursive solution to the 0/1 knapsack problem, this is used for floating point calculations
         * Refer to docs for more information on the algorithm
         * 
         * @param {Array} tasks The array of tasks for the knapsack algo to solve
         * @param {Number} target The target number of hours each person should ideally do
         * 
         * @returns {Array} An array contain 0/1 for which person should take the task
         * 
         */
        customKnapsackRec(tasks, target){
            // Not Implemented for now
            return;
        },
        /**
         * @function
         * Helper funciton to abstract the knapsack algorithm from processing the results
         * Note: The algorithm used here is a recursive solution with a DP memorization table to the 0/1 knapsack problem, this is for assumed integer algo calculations
         * As such tasks is assumed to only contain integers, with target floored, due to splitting of tasks into 2 subsets with closest equal sum K of elements in each subset
         * The task taken, (task allocation with 1) will always try to reach the target, leaving the task not taken (0) always having more or equal work
         * 
         * Refer to docs for more information on the algorithm
         * 
         * @param {Array} tasks The array of tasks for the knapsack algo to solve
         * @param {Number} target The target number of hours each person should ideally do
         * 
         * @returns {Array} An array contain 0/1 for which person should take the task
         * 
         */
        customKnapsackDPMem(tasks, target){
            // Flooring the target
            target = Math.floor(target);
            // Creating the DP table
            let dp = [];
            // Creating the allocation array, where 0 means that the item is not taken and 1 is
            let tasksAllocation = [];
            // Populating the DP and allocation arr at the same time
            for(let i=0; i<tasks.length; i++){
                // tasks.length number of rows, i -> (maps to) i in tasks
                let arr = [];
                tasksAllocation.push(0);
                for(let j=0; j<target+1; j++){
                    // 0 - target number of columns to represent each integer in weight
                    arr.push(-1);
                }
                dp.push(arr);
            }
            // Recursive function(Algo) to solve the problem and populate DP table
            function rec(n, c){
                // If problem was previously solved
                if(n !== 0){
                    if(dp[n-1][c] > -1){
                        return dp[n-1][c];
                    }
                }
                // Main pushing factor
                let result;
                if(n === 0 || c === 0){
                    // Base Case
                    return 0;
                }
                else if(tasks[n-1] > c){
                    // Tasks is too heavy to take
                    result = rec(n-1, c);
                }
                else{
                    // Normal case
                    const takeItem = tasks[n-1] + rec(n-1, c - tasks[n-1]);
                    const dontTakeItem = rec(n-1, c);
                    result = Math.max(takeItem, dontTakeItem);
                }
                dp[n-1][c] = result;
                return result;
            }
            // Call rec algo to populate DP table
            rec(tasks.length, target);
            // Main algo to backtrack the DP table and find the task allocations
            function findTasks(i, j){
                // Base case
                if(j === 0){
                    // There is nothing else to take
                    return;
                }
                if(dp[i][j] === 0){
                    // Nothing else to take as well
                    return;
                }
                // Got to the 0 item, which means that item is taken
                if(i === 0){
                    tasksAllocation[i] = 1;
                    return;
                }
                // Pushing factor
                if(dp[i][j] === dp[i-1][j]){
                    // If same as the above value
                    return findTasks(i-1, j);
                }
                else{
                    // If different, this item is taken and go on to find where is next place to start searching down
                    tasksAllocation[i] = 1;
                    return findTasks(i-1, j-tasks[i]);
                }
            }
            findTasks(tasks.length - 1, target);
            return tasksAllocation;
        }
    },
};

module.exports = advancedAlgo;