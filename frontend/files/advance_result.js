/**
 * @fileoverview This file deals with the various functions that makes Ajax calls to the backend
 * 
 * @author Sherisse Tan
 */


/**
 * @function Obtaining the data to be shown in the basic resultViewer table and appending it directly to the table as well as using said data to create a graph that will provide a graphical view of the data
 * 
 * @param {String} projectId The ID of the project whose tasks is to be separated 
 */
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
};