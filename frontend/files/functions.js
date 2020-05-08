/**
 * @function
 * Sorting the data in the column
 */
function sortData() {
    console.log("SORT")
};


/**
 * @function
 * Inserting a new row of data into the db
 * 
 * @param {string} taskID The task ID of the new task that is to be inserted
 * @param {string} projectID The project ID of the new task that is to be inserted
 * @param {string} dueDate The due date of the new task that is to be inserted
 * @param {string} dueTime The due time of the new task that is to be inserted
 * @param {string} duration The duration of the new task that is to be inserted
 * 
 * @returns The value of each of the parameters in JSON format
 * 
 */
function insertTask(taskID, projectID, dueDate, dueTime, duration) {
    var data = {
        "taskID": taskID,
        "projectID": projectID,
        "dueDate": dueDate,
        "dueTime": dueTime,
        "duration": duration
    };

    return data
};

export default {
    sortData,
    insertTask
}