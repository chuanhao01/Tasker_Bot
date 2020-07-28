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

            // Always append the first page to the pagination display
            var defaultPaginationHtml = `
            <li class="page-item" id="defaultPage">
                <a class="page-link" id="page_1" href="#" onclick="changePage()">1</a>
            </li>
            `;
            $('#paginationDisplay').append(defaultPaginationHtml);


            // Obtain the values of the lastPage (from the API endpoint) and the current page(argument)
            var lastPage = data.result.lastPage;
            var currentPage = parseInt(page.split('=')[1]);
            
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


/**
 * @function Obtaining the data to be shown in the basic resultViewer table and appending it directly to the table as well as using said data to create a graph that will provide a graphical view of the data
 * 
 * @param {String} projectId The project ID whose task lateness is to be computed
 * @param {String} startDate The start date of the project
 * @param {String} startTime The start time of the project
 */
function basic_obtainResult(projectId, startDate, startTime) {
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
                // Checking if there is a lateness. If so, deadline to end
                if (data.lateness > 0) {
                    if (moment(data.fromTime).isAfter(moment(data.deadlineTime), 'hour')) {
                        data.fromTime = data.deadlineTime;
                    }

                    task = {
                        name: `TaskId: ${data.taskId}`,
                        intervals: [{
                            from: moment(`${data.fromDate} ${data.fromTime}`, 'YYYY/MM/DD HHmm').toDate(),
                            to: moment(`${data.deadlineDate} ${data.deadlineTime}`, 'YYYY/MM/DD HHmm').toDate(),
                            label: `TaskId: ${data.taskId}`,
                            tooltip_data: 'Before appointed deadline',
                            fromTime: data.fromTime,
                            toTime: data.deadlineTime
                        }],
                        // Set the default color of the bar as light green -> indicates no lateness
                        color: '#8FBC8F'
                    }

                    latenessInterval = {
                        name: `TaskId: ${data.taskId}`,
                        intervals: [{
                            from: moment(`${data.deadlineDate} ${data.deadlineTime}`, 'YYYY/MM/DD HHmm').toDate(),
                            to: moment(`${data.toDate} ${data.toTime}`, 'YYYY/MM/DD HHmm').toDate(), 
                            label: `TaskId: ${data.taskId}`,
                            tooltip_data: 'Lateness period',
                            fromTime: data.deadlineTime,
                            toTime: data.toTime
                        }],
                        // Set the default color of the bar as light red -> indicates lateness
                        color: '#CD5C5C'
                    }
                }
                
                // No lateness, start to end
                else {
                    // The assigned duration of task
                    task = {
                        name: `TaskId: ${data.taskId}`,
                        intervals: [{
                            from: moment(`${data.fromDate} ${data.fromTime}`, 'YYYY/MM/DD HHmm').toDate(),
                            to: moment(`${data.toDate} ${data.toTime}`, 'YYYY/MM/DD HHmm').toDate(), 
                            label: `TaskId: ${data.taskId}`,
                            tooltip_data: 'Completion of task on schedule',
                            fromTime: data.fromTime,
                            toTime: data.toTime
                        }],
                        // Set the default color of the bar as light green -> indicates no lateness
                        color: '#8FBC8F'
                    }
                }   

                allTasks.push(task);
                if (data.lateness > 0) {
                    allTasks.push(latenessInterval)
                }

                categories.push(`Task ${data.taskId}`);
            })

            function createGraph(allTasks, categories) {
                // re-structure the tasks into line series
                var series = [];
                var skippedRows = 0;
                var yValue = 0;
                $.each(allTasks.reverse(), function(i, task) {
                    var item = {
                        name: task.name,
                        data: [],
                        color: task.color
                    };

                    // Change the yValue if there is a lateness (ensures that the lateness bar is plotted in the same row)
                    if(i != 0 && task.name.split('_')[0] == allTasks[i - 1].name.split('_')[0]) {
                        yValue = i - 1;
                        skippedRows += 1;
                    }
                    yValue = i - skippedRows;

                    $.each(task.intervals, function(j, interval) {
                        item.data.push({
                            x: interval.from,
                            y: yValue,
                            label: interval.label,
                            from: interval.from,
                            to: interval.to,
                            tooltip_data: interval.tooltip_data
                        }, 
                        {
                            x: interval.to,
                            y: yValue,
                            label: interval.label,
                            from: interval.from,
                            to: interval.to,
                            tooltip_data: interval.tooltip_data
                        });
                    });

                    series.push(item);
                });

                // Creating the chart
                const timezoneOffset = new Date().getTimezoneOffset()
                new Highcharts.Chart({
                    chart: {
                        renderTo: 'container'
                    },

                    title: {
                        text: 'Graphical view of tasks'
                    },

                    xAxis: {
                        startOnTick: true,
                        type: 'datetime'
                    },

                    time: {
                        timezoneOffset: timezoneOffset
                    },
                    global: {
                        useUTC: false,
                        timezoneOffset: timezoneOffset
                    },

                    yAxis: {
                        min: 0,
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
                
                    plotOptions: {
                        line: {
                            lineWidth: 10,
                            marker: {
                                enabled: false
                            }
                        }
                    },
                
                    // Defining the tooltip of each task bar (hover over the relevant bars to view) 
                    tooltip: {
                        formatter: function() {
                            var fromTime = (parseInt(Highcharts.dateFormat('%H', this.point.options.from)) * 100) - (timezoneOffset / 60 * 100)
                            var toTime = (parseInt(Highcharts.dateFormat('%H', this.point.options.to) * 100)) - (timezoneOffset / 60 * 100)

                            if (toTime > 2400) {
                                extraDays = Math.floor(toTime / 2400)
                                toTime = (toTime - (2400 * extraDays)).toString();
                                
                                while (toTime.length < 4) {
                                    toTime = "0" + toTime
                                }
                            } 

                            return (
                            '<b>' + this.point.options.label + 
                            '</b><br/>' + this.point.options.tooltip_data +
                            '<br>' + Highcharts.dateFormat('%d-%m-%Y', this.point.options.from) +
                            ' to ' + Highcharts.dateFormat('%d-%m-%Y', this.point.options.to) +
                            '<br>' + fromTime +
                            ' to ' + toTime +
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


function advanced_obtainResult(projectId) {
    var url = `http://localhost:3000/advance/result?projectId=${projectId}`;

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
            var allData = data.result;
            let memberCount = 0;

            // Table
            allData.forEach((member) => {
                memberCount++;

                var total_taskCount = member.length;
                var taskCount = 0
                var assignmentResults = []

                var tasksAssigned = '';
                var hoursAssigned = 0;

                member.forEach((task) => {
                    taskCount++;
                    
                    tasksAssigned += task.taskId + ", ";
                    hoursAssigned += parseInt(task.duration);   
                    
                    if (taskCount == total_taskCount) {
                        // Trim off the ending ", "
                        tasksAssigned = tasksAssigned.slice(0, tasksAssigned.length - 2);

                        assignmentResults.push(tasksAssigned);
                        assignmentResults.push(hoursAssigned);
                    };
                });

                var dataHtml = `
                    <tr class='dataRow' id='data_${memberCount}'>
                        <th scope="row" id="member_data">${memberCount}</th>
                        <th id="tasksAssigned_data">${assignmentResults[0]}</th>
                        <th id="hoursAssigned_data">${assignmentResults[1]}</th>
                    </tr>
                `;
                $('#advanced_resultTableBody').append(dataHtml);
            });




            // Generate the data for the graph
            var numMembers = allData.length;
            var categories = [];
            for (i = 0; i <= numMembers; i++) {
                categories.push(`Member ${i + 1}`);
            };

            var series = []
            var currentMember = 0;
            allData.forEach((member) => {
                currentMember++;

                for (i = 0; i < member.length; i++) {
                    var currentTask = member[i];

                    item = {
                        name: `Task ${currentTask.taskId}`,
                        data: [parseInt(currentTask.duration)]
                    };

                    for (count = 1; count < currentMember; count++) {
                        item.data.unshift(0)
                    };

                    series.push(item);
                };
            });


            // Graph
            new Highcharts.chart({
                chart: {
                    renderTo: 'container',
                    type: 'bar'
                },
                title: {
                    text: 'Distribution of tasks and hours assigned per member'
                },

                xAxis: {
                    categories: categories,
                    title: {
                        text: 'Member'
                    }
                },

                yAxis: {
                    min: 0,
                    title: {
                        text: 'Hours Assigned'
                    }
                },

                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },

                series: series
            });
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
            window.alert("An error occurred in: advanced_obtainResult()");
        }
    })
}


const allFunctions = {
    basic_obtainData: basic_obtainData,
    advanced_obtainData: advanced_obtainData,
    basic_obtainResult: basic_obtainResult,
    advanced_obtainResult: advanced_obtainResult
}

module.exports = allFunctions;