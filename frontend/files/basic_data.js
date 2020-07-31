/**
 * @fileoverview This file deals with the various functions that makes Ajax calls to the backend
 * 
 * @author Sherisse Tan
 */


/**
 * @function Obtaining the data to be shown in the basic dataviewer table and appending it directly to the table as well as controlling the pagination view of said table
 *           This will handle SORTING, FILTERING and OBTAINING data && Pagination
 * 
 * @param {string} projectId The project ID of the new task that is to be inserted
 * @param {string} duration The duration of the new task that is to be inserted
 * @param {string} sortBy The column to be sorted by
 * @param {string} page The page number that we are on / navigating to
 * @param {string} pageNum The number of tasks displayed on each page
 */
function basic_obtainData(projectId, duration, page, pageNum, sortBy) {
    var url = `http://localhost:3000/basic/data?${projectId}&${duration}&${sortBy}&${page}&${pageNum}`;

    $.ajax({
        type: 'GET',
        url: url,
        // Datatype that we are expecting back from the server
        dataType: 'json', 

        /**
         * @function Handling the event in which the ajax request call is a success
         * 
         * @param {JSON} data The task data that we are getting from the server
         * @param {string} textStatus A string stating whether the call was a success or failure
         * @param xhr The XMLHttpRequest 
         */
        success: function(data, textStatus, xhr) {
            // Ensure that the data viewer table is empty before appending any data
            $('#basic_tableBody').empty();

            var allTaskData = data.result.data;
            // Appending each task to a row in the table
            allTaskData.forEach((task) => {
                const taskHtml = `
                <tr class="dataRow" id="data_${task.taskid}">
                    <th scope="row" id="taskId_data">${task.taskId}</th>
                    <th id="projectId_data">${task.projectId}</th>
                    <th id="duedate_data">${task.dueDate}</th>
                    <th id="duetime_data">${task.dueTime}</th>
                    <th id="duration_data">${task.duration}</th>
                    <th>
                        <button class="btn btn-outline-success" type="button" data-toggle="modal" data-target="#insert_editModal" id="editBtn">Edit</button>
                    </th>
                    <th>
                        <button class="btn btn-outline-danger" type="button" id="deleteBtn">Delete</button>
                    </th>
                </tr>
                `

                $('#basic_tableBody').append(taskHtml);
            })



            // Clear the current pagination display
            $('#paginationDisplay').empty();

            // Obtain the values of the lastPage (from the API endpoint) and the current page(argument)
            var lastPage = data.result.lastPage;
            var currentPage = parseInt(page.split('=')[1]);

            // Indication of the current page that the user is on
            var currentPageHtml = `
                <h6 class="dropdown-header">Current page: ${currentPage}</h6>
            `;
            $('#paginationDisplay').append(currentPageHtml);

            
            for (i = 0; i <= lastPage; i++) {
                // Ensure that the user is unable to click the currentPage again and that the first page is always shown 
                if (i + 1 == currentPage && i != 0) {
                    continue;
                }

                var paginationHtml = `
                    <a class="dropdown-item">Page ${i + 1}</a>
                `;
                $('#paginationDisplay').append(paginationHtml);
            }
        },

        /**
         * @function Handling the event in which the ajax request call has an error
         * 
         * @param xhr The XMLHttpRequest
         * @param {string} textStatus A string stating whether the call was a success or failure
         * @param err The error message / response sent back by the server
         */
        error: function(xhr, textStatus, err) {
            console.log({
                status: textStatus,
                err: err
            });
            window.alert("An error occurred in: basic_obtainData()");
        }
    }); // End of ajax call
};