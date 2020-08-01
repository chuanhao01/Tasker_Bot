/**
 * @fileoverview This file contains the function(s) that will be needed for the advanced dataViewer
 *      - advanced_obtainData()
 * 
 * @author Sherisse Tan
 */


 /**
 * @function Obtaining the data to be shown in the advanced dataviewer table and appending it directly to the table as well as controlling the pagination view of said table
 *           This will handle SORTING, FILTERING and OBTAINING data && Pagination
 * 
 * @param {string} projectId The project ID of the new task that is to be inserted
 * @param {string} duration The duration of the new task that is to be inserted
 * @param {string} sortBy The column to be sorted by
 * @param {string} page The page number that we are on / navigating to
 * @param {string} pageNum The number of tasks displayed on each page
 */
function advanced_obtainData(projectId, duration, page, pageNum, sortBy) {
    var url = `http://localhost:3000/advance/data?${projectId}&${duration}&${sortBy}&${page}&${pageNum}`;

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
            console.log(data)
            // Clear the previous data from the table
            $('#advanced_tableBody').empty();

            var allTaskData = data.result.data;
            var lastPage = data.result.lastPage;


            // Appending each task to a row in the table
            allTaskData.forEach((task) => {
                const taskHtml = `
                <tr class="dataRow" id="data_${task.taskId}">
                    <th scope="row" id="taskId_data">${task.taskId}</th>
                    <th id="projectId_data">${task.projectId}</th>
                    <th id="duration_data">${task.duration}</th>
                    <th>
                        <button class="btn btn-outline-success" type="button" data-toggle="modal" data-target="#insert_editModal" id="editBtn">Edit</button>
                    </th>
                    <th>
                        <button class="btn btn-outline-danger" type="button" id="deleteBtn">Delete</button>
                    </th>
                </tr>
                `

                $('#advanced_tableBody').append(taskHtml);
            });


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

            
            for (i = 1; i <= lastPage; i++) {
                var paginationHtml = `
                    <a class="dropdown-item" id="page_${i}" href="#" onclick="changePage()">Page ${i}</a>
                `;
                $('#paginationDisplay').append(paginationHtml);
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
            // Defining the appropriate error messages and log the actual error to the console
            var statusCode = xhr.status;
            var errorMsg = '';
            var error_console = "Error: " + statusCode + ", " + err;
            switch(statusCode) {
                case 400:
                    errorMsg = "An unexpected error occurred, please check your inputs..";
                    console.log(error_console);
                    break;
                
                case 500:
                    errorMsg = "An unexpected error occurred.. Please try again later..";
                    console.log(error_console);
                    break;

                default:
                    errorMsg = "Oops.. something went wrong. Please check your inputs and try again later..";
                    console.log(error_console)
            };


            // Defining and appending the error message in the form of a bootstrap modal
            var errorHtml = `
                <div class="modal" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="errorMsg_modal" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="errorMsg_modal">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="dismissModal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                ${errorMsg}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.innerHTML += errorHtml;
            $('#errorModal').modal('show');

            // Refresh the page
            $('#dismissModal').click(() => {
                location.reload()
            });
        }
    })
};