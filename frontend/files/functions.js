/**
 * @author Sherisse Tan
 */


/**
 * @function Sorting the data in the column
 */
function sortData() {
    console.log("SORT")
};


/**
 * @function Deleting an existing record in the db
 */
function deleteData() {
    console.log("DELETE")
};


/**
 * @function Inserting a new row of data into the db
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
function edit_insertTask(taskID, projectID, dueDate, dueTime, duration) {
    var data = {
        "taskID": taskID,
        "projectID": projectID,
        "dueDate": dueDate,
        "dueTime": dueTime,
        "duration": duration
    };

    return data
};


/**
 * @function Obtaining the data to be shown in the dataviewer table
 * 
 * @returns The data to be shown in the dataviewer table
 */
function obtainData(data) {
    var dataViewerTable = document.querySelector('#dataViewerTable');

    var data = [{
        
    }]

    dataViewerTable.ajax({
        method: 'GET',

        /**
         * @function Calling the api endpoint to obtain data
         * 
         * @param {JSON object} data The data containing all the tasks and their information to be shown
         * @param {int} err Whether there are any errors in obtaining the response
         */
        success: function(data, err) {
            if (err != null) {
                console.log("An error occurred..");
            }

            else {

            }
        }
    })
};

const allFunctions = {
    sortData: sortData,
    edit_insertTask: edit_insertTask,
    deleteData: deleteData,
    obtainData: obtainData
}

module.exports = allFunctions;