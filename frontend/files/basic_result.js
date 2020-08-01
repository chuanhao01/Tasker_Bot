/**
 * @fileoverview This file contains the function(s) that will be needed for the basic resultViewer
 *      - basic_obtainResult()
 * 
 * @author Sherisse Tan
 */


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