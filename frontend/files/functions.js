/**
 * @author Sherisse Tan
 */


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
 * @function Obtaining the data to be shown in the dataviewer table and appending it directly to the table. 
 *           This will handle SORTING, FILTERING and OBTAINING data
 * 
 * @params {string} projectId The project ID of the new task that is to be inserted
 * @params {string} duration The duration of the new task that is to be inserted
 * @params {string} page The page number that we are on / navigating to
 * @params {string} pageNum The number of tasks displayed on each page
 * @params {string} sortBy The column to be sorted by
 */
function obtainData(projectId, duration, page, pageNum, sortBy) {
    var url = `http://localhost:3000/basic/data?${projectId}&${duration}&${sortBy}&${page}&${pageNum}`;

    $.ajax({
        type: 'GET',
        url: url,
        // Data that we are expecting back from the server
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
            $('#tableBody').empty();

            var allTaskData = data.data;
            // Appending each task to a row in the table
            allTaskData.forEach((task) => {
                const taskHtml = `
                <tr class="dataRow" id="data_${task.taskid}">
                    <th scope="row" id="taskId_data">${task.taskid}</th>
                    <th id="projectId_data">${task.projectid}</th>
                    <th id="duedate_data">${task.duedate}</th>
                    <th id="duetime_data">${task.duetime}</th>
                    <th id="duration_data">${task.duration}</th>
                    <th>
                        <button class="btn btn-outline-success" type="button" data-toggle="modal" data-target="#insert_editModal" id="editBtn">Edit</button>
                    </th>
                    <th>
                        <button class="btn btn-outline-danger" type="button" id="deleteBtn">Delete</button>
                    </th>
                </tr>
                `

                $('#tableBody').append(taskHtml);
            })
        },

        /**
         * @function Handling the event in which the ajax request call has an error
         * 
         * @param xhr The XMLHttpRequest
         * @param @param {string} textStatus A string stating whether the call was a success or failure
         * @param err The error message / response sent back by the server
         */
        error: function(xhr, textStatus, err) {
            console.log({
                status: textStatus,
                err: err
            });
            window.alert("An error occurred in: obtainData()");
        }
    }); // End of ajax call
};


/**
 * @function Obtain the total number of pages
 * 
 * @params {string} projectId The project ID of the new task that is to be inserted
 * @params {string} duration The duration of the new task that is to be inserted
 * @params {string} page The page number that we are on / navigating to
 * @params {string} pageNum The number of tasks displayed on each page
 * @params {string} sortBy The column to be sorted by
 */
function obtainTotalPage(projectId, duration, sortBy, page, pageNum) {
    var url = `http://localhost:3000/basic/data/lastpage?${projectId}&${duration}&${sortBy}&${page}&${pageNum}`;
    console.log(pageNum)
    console.log(url)

    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',

                /**
         * @function Handling the event in which the ajax request call is a success
         * 
         * @param {JSON} data The task data that we are getting from the server
         * @param {string} textStatus A string stating whether the call was a success or failure
         * @param xhr The XMLHttpRequest 
         */
        success: function(data, textStatus, xhr) {
            // Always append the first page to the pagination display
            $('#paginationDisplay').empty();
            var defaultPaginationHtml = `
            <li class="page-item">
                <a class="page-link" id="page_1" href="#">1</a>
            </li>
            `;
            $('#paginationDisplay').append(defaultPaginationHtml);

            var lastPage = data.data.lastPage;
            var currentPage = parseInt(page.split('=')[1]);


            // Define preset html codes to either append / prepend to the pagination (#paginationDisplay)
            var nextPageHtml = `
            <li class="page-item">
                <a class="page-link" id="page_${currentPage + 1}" href="#">${currentPage + 1}</a>
            </li>
            `;

            var currentPageHtml = `
            <li class="page-item">
                <a class="page-link" id="page_${currentPage}" href="#">${currentPage}</a>
            </li>
            `;

            var previousPageHtml = `
            <li class="page-item">
                <a class="page-link" id="page_${currentPage - 1}" href="#">${currentPage - 1}</a>
            </li>
            `;

            var nextPageHtml_symbol = `
            <li class="page-item">
                <a class="page-link" id="page_next" href="#!" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  <span class="sr-only">Next</span>
                </a>
            </li>
            `;

            var previousPageHtml_symbol = `
            <li class="page-item">
                <a class="page-link" id="page_previous" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  <span class="sr-only">Previous</span>
                </a>
            </li>
            `;


            // Second page
            if (currentPage == 2) {
                var paginationHtml_prepend = `
                    ${previousPageHtml_symbol}
                `;
                $('#paginationDisplay').prepend(paginationHtml_prepend);
            }

            // Last page with other pages before it
            else if (currentPage == lastPage && currentPage != 1) {
                var paginationHtml_prepend = `
                    ${previousPageHtml_symbol}
                    ${previousPageHtml}
                `;
                $('#paginationDisplay').prepend(paginationHtml_prepend);
            }

            // Any other pages
            else if (currentPage != 1 && lastPage > 1) {
                var paginationHtml_prepend = `
                    ${previousPageHtml_symbol}
                `;
                $('#paginationDisplay').prepend(paginationHtml_prepend);

                var paginationHtml_append = `
                    ...
                    ${previousPageHtml}
                    ${currentPageHtml}
                `;
                $('#paginationDisplay').append(paginationHtml_append);
            };

            // For all pages, append the page-link for pagination to the next page where appropriate
            if (lastPage > currentPage) {
                var paginationHtml_append = `
                    ${nextPageHtml}
                    ${nextPageHtml_symbol}
                `;
                $('#paginationDisplay').append(paginationHtml_append);
            }
        },

        /**
         * @function Handling the event in which the ajax request call has an error
         * 
         * @param xhr The XMLHttpRequest
         * @param @param {string} textStatus A string stating whether the call was a success or failure
         * @param err The error message / response sent back by the server
         */
        error: function(xhr, textStatus, err) {
            console.log({
                status: textStatus,
                err: err
            });
            window.alert("An error occurred in: obtainTotalPage()");
        }
    });
};


const allFunctions = {
    edit_insertTask: edit_insertTask,
    deleteData: deleteData,
    obtainData: obtainData,
    obtainTotalPage: obtainTotalPage
}

module.exports = allFunctions;