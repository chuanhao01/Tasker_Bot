/**
 * @fileoverview This file deals with the various functions that makes Ajax calls to the backend
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

            // Always append the first page to the pagination display
            var defaultPaginationHtml = `
            <li class="page-item" id="defaultPage">
                <a class="page-link" id="page_1" href="#" onclick="changePage()">1</a>
            </li>
            `;
            $('#paginationDisplay').append(defaultPaginationHtml);


            // Obtain the values of the lastPage (from the API endpoint) and the current page(argument)
            var lastPage = data.result.lastPage;
            console.log("Page:" + page)
            var currentPage = parseInt(page.split('=')[1]);
            console.log(currentPage)
            
            // Define preset html codes to either append / prepend to the pagination (#paginationDisplay)
            var nextPageHtml = `
            <li class="page-item">
                <a class="page-link" id="page_${currentPage + 1}" href="#" onclick="changePage()">${currentPage + 1}</a>
            </li>
            `;

            var currentPageHtml = `
            <li class="page-item active">
                <a class="page-link" id="page_${currentPage}" href="#" onclick="changePage()">${currentPage}</a>
            </li>
            `;

            var previousPageHtml = `
            <li class="page-item">
                <a class="page-link" id="page_${currentPage - 1}" href="#" onclick="changePage()">${currentPage - 1}</a>
            </li>
            `;

            var nextPageHtml_symbol = `
            <li class="page-item">
                <a class="page-link" id="page_next" href="#!" aria-label="Next" onclick="changePage()">&raquo;</a>
            </li>
            `;

            var previousPageHtml_symbol = `
            <li class="page-item">
                <a class="page-link" id="page_previous" href="#" aria-label="Previous" onclick="changePage()">&laquo;</a>
            </li>
            `;


            // Adding default page indication when currentPage == 1
            if (currentPage == 1) {
                $('#page_1').parent().addClass("active");
            }

            // Second page
            if (currentPage == 2) {
                var paginationHtml_prepend = `
                    ${previousPageHtml_symbol}
                `;
                $('#paginationDisplay').prepend(paginationHtml_prepend);

                var paginationHtml_append = `
                    ${currentPageHtml}
                `;
                $('#paginationDisplay').append(paginationHtml_append);
            }

            // Last page with other pages before it
            else if (currentPage == lastPage && currentPage != 1) {
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
            window.alert("An error occurred in: advanced_obtainData()");
        }
    })
};