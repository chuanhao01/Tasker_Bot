/**
 * @fileoverview This file contains the function(s) that will be needed for the advanced resultViewer
 *      - advanced_obtainResult()
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