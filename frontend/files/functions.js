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
function obtainData() {
    console.log("TEST");

    var dataViewerTable = document.querySelector('#dataViewerTable');
    // What the hell is pgRes in basicController (line 159)
    var data = {};

    /*
    // Ajax call to the backend server
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            dataViewerTable.innerHTML = "TEST"
        };
    };

    xhttp.open("GET", "localhost:3000/basic/data")
    xhttp.send();
    */

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/basic/data',
        // Data that we are expecting back from the server
        dataType: 'json', 

        /**
         * @function
         * 
         * @param {JSON} data The task data that we are getting from the server
         * @param {int} statusCode The response status code
         * @param xhr The XMLHttpRequest 
         */
        success: function(data, statusCode, xhr) {
            console.log(data);
            console.log(statusCode);
        },

        /**
         * 
         * @param xhr The XMLHttpRequest
         * @param {int} statusCode The response status code
         * @param err The error message / response sent back by the server
         */
        error: function(xhr, statusCode, err) {
            console.log(err);
            window.alert("An error occurred");
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