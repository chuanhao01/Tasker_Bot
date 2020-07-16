/**
 * @fileoverview This file deals with the various functions that makes Ajax calls to the backend
 * 
 * @author Sherisse Tan
 */

/**
 * @function Calculates the appropriate actual end dates and times for each task, taking lateness into account
 * 
 * @param {JSON} data 
 * 
 * @returns A JSON object containing the calulcated end_date (in UTC format) and end_time (int)
 */
function get_lateness(data) {
    // Obtain the number of days and number of hours task is late by
    late_days = parseInt(data.lateness / 24);
    late_hrs = data.lateness - (late_days * 24);
    late_mins = (late_hrs - Math.floor(late_hrs)) * 60
    late_hrs = (Math.floor(late_hrs) * 100) + late_mins


    // Calculate the final end_day and end_time
    add_days = 0; // The number of days that we have to add to the final count due to overflow in hours
    end_time = parseInt(data.toTime) + late_hrs
    if (end_time > 2400) {
        end_time -= 2400;
        add_days += 1;
    }

    // If the last 2 digits >= 60 -> next hour (1hr == 60min)
    if ((end_time % 100) >= 60) {
        end_time -= (end_time % 100);
        end_time += 100;

        // If the end_time is midnight
        if (end_time == 2400) {
            end_time = 0000;
            add_days += 1;
        };
    };

    end_day = parseInt(data.toDate.split('/')[2]) + late_days + add_days
    end_day = Date.UTC(parseInt(data.fromDate.split('/')[0]), parseInt(data.fromDate.split('/')[1]), end_day)

    return lateness = {
        end_day: end_day,
        end_time: end_time
    }
    /*
    from: Date.UTC(parseInt(fromDate[0]), parseInt(fromDate[1]), parseInt(fromDate[2]), fromTime),
                        to: Date.UTC(parseInt(toDate[0]), parseInt(toDate[1]), parseInt(toDate[2]), toTime),
                        label: `${data.taskId}`,
                        tooltip_data: 'Assigned time to complete task',
                        fromTime: data.fromTime,
                        toTime: data.toTime */
}


/**
 * @function Obtaining the data to be shown in the basic dataviewer table and appending it directly to the table as well as controlling the pagination view of said table
 *           This will handle SORTING, FILTERING and OBTAINING data && Pagination
 * 
 * @params {string} projectId The project ID of the new task that is to be inserted
 * @params {string} duration The duration of the new task that is to be inserted
 * @params {string} sortBy The column to be sorted by
 * @params {string} page The page number that we are on / navigating to
 * @params {string} pageNum The number of tasks displayed on each page
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

                $('#basic_tableBody').append(taskHtml);
            })



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
            window.alert("An error occurred in: basic_obtainData()");
        }
    }); // End of ajax call
};


/**
 * @function Obtaining the data to be shown in the advanced dataviewer table and appending it directly to the table as well as controlling the pagination view of said table
 *           This will handle SORTING, FILTERING and OBTAINING data && Pagination
 * 
 * @params {string} projectId The project ID of the new task that is to be inserted
 * @params {string} duration The duration of the new task that is to be inserted
 * @params {string} sortBy The column to be sorted by
 * @params {string} page The page number that we are on / navigating to
 * @params {string} pageNum The number of tasks displayed on each page
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
                <tr class="dataRow" id="data_${task.taskid}">
                    <th scope="row" id="taskId_data">${task.taskid}</th>
                    <th id="projectId_data">${task.projectid}</th>
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


function basic_obtainResult(projectId, startDate, startTime) {
    // Define some correct values first -> REMOVE THIS
    projectId = '1100000001';
    startDate = '2020/01/13';
    startTime = '2130'

    var url = `http://localhost:3000/basic/result?projectId=${projectId}&startDate=${startDate}&startTime=${startTime}`;

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
        success: function (data, textStatus, xhr) {
            // Clear the table of data
            $('#basic_resultTableBody').empty();

            var allData = data.result;
            var totalLateness = data.totalLateness;

            // Task information
            allData.forEach((data) => {
                var dataHtml = `
                   <tr class='dataRow' id='data_${data.taskId}'>
                        <th scope="row" id="taskId_data">${data.taskId}</th>
                        <th id="fromDate_data">${data.fromDate}</th>
                        <th id="fromTime_data">${data.fromTime}</th>
                        <th id="toDate_data">${data.toDate}</th>
                        <th id="toTime_data">${data.toTime}</th>
                        <th id="lateness_data">${data.lateness}</th>
                    </tr>
                `;
                $('#basic_resultTableBody').append(dataHtml);
            });


            // Total lateness
            latenessHtml = `
                <tr class='dataRow' id='data_totalLateness'>
                    <th scope='row'></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Total lateness:</th>
                    <th id='totalLateness_data'>${totalLateness}</th>
                </tr>
            `;
            $('#basic_resultTableBody').append(latenessHtml);



            // Create tasks
            allTasks = []
            categories = []
            allData.forEach((data) => {
                var fromDate = data.fromDate.split('/');
                var toDate = data.toDate.split('/');
                var fromTime = parseInt(data.fromTime.slice(0, 2));
                var toTime = parseInt(data.toTime.slice(0, 2));


                // The assigned duration of task
                task = {
                    name: `TaskId: ${data.taskId}`,
                    intervals: [{
                        from: Date.UTC(parseInt(fromDate[0]), parseInt(fromDate[1]), parseInt(fromDate[2]), fromTime),
                        to: Date.UTC(parseInt(toDate[0]), parseInt(toDate[1]), parseInt(toDate[2]), toTime),
                        label: `${data.taskId}`,
                        tooltip_data: 'Assigned time to complete task',
                        fromTime: data.fromTime,
                        toTime: data.toTime
                    }],
                    // Set the default color of the bar as light green -> indicates no lateness
                    color: '#8FBC8F'
                }

                // Checking if there is a lateness and add it to 'task' if so
                if (data.lateness > 0) {
                    latenessInterval_data = get_lateness(data);

                    latenessInterval = {
                        from: latenessInterval_data.end_day,
                        to: latenessInterval_data.end_day,
                        label: `${data.taskId}`,
                        tooltip_data: 'Task completed',
                        fromTime: latenessInterval_data.end_time,
                        toTime: latenessInterval_data.end_time,
                    }
                    
                    task.intervals.push(latenessInterval);
                    // This will change the color of the bars to a light red -> indicate lateness
                    task.color = '#CD5C5C';
                }

                allTasks.push(task);
                categories.push(`Task ${data.taskId}`);
            })

            function createGraph(allTasks, categories) {
                // re-structure the tasks into line series
                var series = [];
                $.each(allTasks.reverse(), function(i, task) {
                    var item = {
                        name: task.name,
                        data: [],
                        color: task.color
                    };

                    $.each(task.intervals, function(j, interval) {
                        item.data.push({
                            x: interval.from,
                            y: i,
                            label: interval.label,
                            from: interval.from,
                            to: interval.to,
                            tooltip_data: interval.tooltip_data
                        }, 
                        {
                            x: interval.to,
                            y: i,
                            from: interval.from,
                            to: interval.to,
                            tooltip_data: interval.tooltip_data
                        });
                    
                        // add a null value between intervals
                        if (task.intervals[j + 1]) {
                            item.data.push([(interval.to + task.intervals[j + 1].from) / 2, null]);
                        }
                    });

                    series.push(item);
                });

                // Creating the chart
                new Highcharts.Chart({
                    chart: {
                        renderTo: 'container'
                    },

                    title: {
                        text: 'Graphical view of tasks'
                    },

                    xAxis: {
                        type: 'datetime'
                    },

                    yAxis: {
                        min: 0,
                        max: allTasks.length - 1,
                        categories: categories,
                        tickInterval: 1,            
                        tickPixelInterval: 200,
                        labels: {
                            style: {
                                color: '#525151',
                                font: '12px Helvetica',
                                fontWeight: 'bold'
                            }
                        },
                        startOnTick: false,
                        endOnTick: false,
                        title: {
                            text: null
                        },
                        minPadding: 0.2,
                        maxPadding: 0.2,
                        fontSize:'15px'
                    },

                    legend: {
                        enabled: false
                    },
                
                    // Defining the tooltip of each task bar (hover over the relevant bars to view)
                    

                    plotOptions: {
                        line: {
                            lineWidth: 10,
                            marker: {
                                enabled: false
                            }
                        }
                    },

                    tooltip: {
                        formatter: function() {
                            return (
                            '<b>' + allTasks[this.y].name + 
                            '</b><br/>' + this.point.options.tooltip_data +
                            '<br>' + Highcharts.dateFormat('%d-%m-%Y', this.point.options.from) +
                            ' to ' + Highcharts.dateFormat('%d-%m-%Y', this.point.options.to) +
                            '<br>' + allTasks[this.y].intervals[0].fromTime +
                            ' to ' + allTasks[this.y].intervals[0].toTime +
                            '</br>'
                            ); 
                        }
                    },

                    // Defining the dataset for the graph as the array 'series' defined at the start of the script
                    series: series
                });		         
            };

            categories = categories.reverse();
            createGraph(allTasks, categories);

            // Reveal the table
            $('.resultViewer').removeAttr('hidden');
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
            window.alert("An error occurred in: basic_obtainResult()");
        }
    })
};


const allFunctions = {
    edit_insertTask: edit_insertTask,
    deleteData: deleteData,
    basic_obtainData: basic_obtainData,
    advanced_obtainData: advanced_obtainData,
    basic_obtainResult: basic_obtainResult
}

module.exports = allFunctions;