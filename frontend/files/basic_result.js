/**
 * @fileoverview This file contains the function(s) that will be needed for the basic resultViewer
 *      - basic_obtainResult()
 *      - createGraph()
 * 
 * @author Sherisse Tan
 */


/**
 * @function Creating the graph (duration / lateness) to be shown in the basic resultViewer using the Highcharts Gantt API
 * 
 * @param {array} allTasks An array containing all the task values to be shown in the graph
 * @param {array} categories An array containing all the taskId in the computed project
 * @param {string} graphType A string denoting the type of graph (duration v lateness)
 */
function createGraph(allTasks, categories, graphType) {
    // re-structure the tasks into line series
    var series = [];
    var yValue = 0;
    $.each(allTasks.reverse(), function(i, task) {
        var item = {
            name: task.name,
            data: [],
            color: task.color
        };

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

            // Increment the yValue with each row of data
            yValue++;
        });

        series.push(item);
    });

    var renderElement = '';
    var graphTitle = '';

    if (graphType == 'duration') {
        renderElement = 'durationGraph';
        graphTitle = 'Time spent working on the task (duration)';
    }
    else {
        renderElement = 'latenessGraph';
        graphTitle = 'Lateness of tasks';
    }

    // Creating the chart
    const timezoneOffset = new Date().getTimezoneOffset()
    new Highcharts.Chart({
        chart: {
            renderTo: renderElement
        },

        title: {
            text: graphTitle
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


/**
 * @function Obtaining the data to be shown in the basic resultViewer table and appending it directly to the table as well as using said data to create a graph that will provide a graphical view of the data
 * 
 * @param {String} projectId The project ID whose task lateness is to be computed
 * @param {String} startDate The start date of the project
 * @param {String} startTime The start time of the project
 */
function basic_obtainResult(projectId, startDate, startTime) {
    // var url = `http://localhost:3000/basic/result?projectId=${projectId}&startDate=${startDate}&startTime=${startTime}`;
    var url = `${baseUrl}/basic/result?projectId=${projectId}&startDate=${startDate}&startTime=${startTime}`

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
            allTasks = [];
            categories = [];
            latenessVals = [];
            allData.forEach((data) => {
                // The assigned duration of task
                task = {
                    name: `TaskId: ${data.taskId}`,
                    intervals: [{
                        from: moment(`${data.fromDate} ${data.fromTime}`, 'YYYY/MM/DD HHmm').toDate(),
                        to: moment(`${data.toDate} ${data.toTime}`, 'YYYY/MM/DD HHmm').toDate(), 
                        label: `TaskId: ${data.taskId}`,
                        tooltip_data: 'Duration spent working on the task',
                        fromTime: data.fromTime,
                        toTime: data.toTime
                    }],
                    // Set the default color of the bar as light green -> indicates no lateness
                    color: '#8FBC8F'
                };

                allTasks.push(task);
                categories.push(`Task ${data.taskId}`);
            });

            categories = categories.reverse();
            createGraph(allTasks, categories, 'duration');


            // Check if there is any lateness
            if (totalLateness > 0) {
                // Append to toggle buttons only if there is a lateness to be shown in a separate graph
                var toggleHtml = `
                        <div class="pt-4 pb-2 d-flex justify-content-center btn-group btn-group-toggle" id="toggleRadio" data-toggle="buttons">
                            <label class="btn btn-secondary active">
                                <input type="radio" name="toggleGraph" id="toggleGraph_duration" autocomplete="off" checked> Duration graph
                            </label>
                            <label class="btn btn-secondary">
                                <input type="radio" name="toggleGraph" id="toggleGraph_lateness" autocomplete="off"> Lateness graph
                            </label>
                        </div>
                `;
                $('.resultGraph').prepend(toggleHtml);

                // Center the radio toggle buttons without affecting the width
                $('#toggleRadio').find('*').css('flex', 'none');


                // Lateness graph values
                allData.forEach((data) => {
                    // Lateness (show lateness period)
                    if (data.lateness > 0) {
                        lateness = {
                            name: `TaskId: ${data.taskId}`,
                            intervals: [{
                                from: moment(`${data.deadlineDate} ${data.deadlineTime}`, 'YYYY/MM/DD HHmm').toDate(),
                                to: moment(`${data.toDate} ${data.toTime}`, 'YYYY/MM/DD HHmm').toDate(),
                                label: `TaskId: ${data.taskId}`,
                                tooltip_data: 'Lateness of task',
                                fromTime: data.deadlineTime,
                                toTime: data.toTime
                            }],
                            // Set the default color of the bar as light red -> indicates lateness
                            color: '#CD5C5C'
                        }
                    }

                    // No lateness (blank row)
                    else {
                        lateness = {
                            name: `TaskId: ${data.taskId}`,
                            intervals: [{
                                from: moment(`${data.deadlineDate} ${data.deadlineTime}`, 'YYYY/MM/DD HHmm').toDate(),
                                to: moment(`${data.deadlineDate} ${data.deadlineTime}`, 'YYYY/MM/DD HHmm').toDate()
                            }],
                            // Set the default color of the bar as light red -> indicates lateness
                            color: '#FFFFFF'
                        }
                    };

                    latenessVals.push(lateness);
                });

                createGraph(latenessVals, categories, 'lateness');
            };
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

                case 404:
                    errorMsg = "Invalid projectId value detected, please check your input..";
                    console.log(error_console)
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