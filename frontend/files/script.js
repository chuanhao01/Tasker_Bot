/**
 * @fileoverview This file deals with the various functions that will affect DOM elements in the HTML file
 * 
 * @author Sherisse Tan
 */


 // Define all the default starting variables needed for the API -> This will be updated as the user performs actions in the website
 var currentPage = 1;
 var pageNumType = 10;
 var sortType = '';

 
/**
 * @function Implementing filter functionality in the basic data viewer table
 */
 function filter() {
    let filterAttribute = $('#filterAttribute option:selected').text();
    let filterOperation = $('#filterOperation option:selected').text();
    let filterInput = $('#filterInput').val();

    // Determining the mathematical filter operation
    if (filterOperation == 'Equal to') {
        filterOperation = '=';
    }
    else if (filterOperation == 'Greater than') {
        filterOperation = '>'
    }
    else {
        filterOperation = '<'
    }

    // Checking the status of the current filter
    var currentFilter_duration = $('#sort_duration').attr('class').split(' ')[2];
    var currentFilter_projectId = $('#sort_projectId').attr('class').split(' ')[2];

    
    // If the current filter attribute is projectId
    if (filterAttribute == 'projectId') {
        var filterType_projectId = `${filterAttribute}[${filterOperation}]=${filterInput}`;

        // Check if there is already a filter being applied to projectId
        if (currentFilter_projectId == 'filteredBy_no') {
            // Change the className for projectId to reflect that it has already been filtered once
            $('#sort_projectId').toggleClass('filteredBy_no filteredBy_yes');
        };
        /* In the event that there is already a filter for the projectId, the className in the column already reflects such and the current filter is replaced by the new filter. This is also true for duration */
        
        // Have not filtered by duration yet -> No need to pass in 2 arguments
        if (currentFilter_duration == 'filteredBy_no') {
            obtainData(`${filterType_projectId}`, "", "", `page=${currentPage}`, `pageNum=${pageNumType}`);
            obtainTotalPage(`${filterType_projectId}`, "", "", `page=${currentPage}`, `pageNum=${pageNumType}`);
        }
        // Already filtered by duration -> Pass in 2 arguments
        else {
            obtainData(`${filterType_projectId}`, duration=`${filterType_duration}`, "", `page=${currentPage}`, `pageNum=${pageNumType}`);
            obtainTotalPage(`${filterType_projectId}`, duration=`${filterType_duration}`, "", `page=${currentPage}`, `pageNum=${pageNumType}`);
        };
    }

    // If the current filter attribute is duration
    else {
        var filterType_duration = `${filterAttribute}[${filterOperation}]=${filterInput}`;

        // Check if there is already a filter being applied to duration
        if (currentFilter_duration == 'filteredBy_no') {
            // Change the className for duration to reflect that it has already been filtered once
            $('#sort_duration').toggleClass('filteredBy_no filteredBy_yes');
        };

        // Have not filtered by projectId yet
        if (currentFilter_projectId == 'filteredBy_no') {
            obtainData("", `${filterType_duration}`, "", `page=${currentPage}`, `pageNum=${pageNumType}`);
            obtainTotalPage("", `${filterType_duration}`, "", `page=${currentPage}`, `pageNum=${pageNumType}`);
        }
        else {
            obtainData(`${filterType_projectId}`, `${filterType_duration}`, "", `page=${currentPage}`, `pageNum=${pageNumType}`);
            obtainTotalPage(`${filterType_projectId}`, `${filterType_duration}`, "", `page=${currentPage}`, `pageNum=${pageNumType}`);
        }
    };
 };


/**
 * @function Implementing sorting functionality in the basic data viewer table
 * 
 * @param {object} eventTarget 
 */
function sort(eventTarget) {
    // Obtain whether the column is already sorted in ascending order or descending order
    var currentSort = eventTarget.className.split(' ')[1];

    // Obtain the id of the button that was clicked and obtain the column name
    var sortType = eventTarget.id.split('_')[1];

    // Change the className of the button for further usage
    $(eventTarget).toggleClass('asc desc')

    // Define whether to sort in ascending or descending order
    if (currentSort == 'asc') {
        sortType += ".desc";
    }
    else {
        sortType += '.asc';
    };
    
    obtainData("", "", `sortBy=${sortType}`, `${currentPage}`, `pageNum=${pageNumType}`);
};


/**
 * @function Implementing sorting functionality in the basic data viewer table
 * 
 * @param {string} pageLinkId 
 */
function pagination(pageLinkId) {
    var paginationType;
    paginationType = pageLinkId.split('_')[1];
        
    // In the event that the page-link clicked was not 'previous' or 'next'
    if (paginationType != 'previous' && paginationType != 'next') {
        obtainData("", "", "", `page=${paginationType}`, `pageNum=${pageNumType}`);
        obtainTotalPage("", "", "", `page=${paginationType}`, `pageNum=${pageNumType}`);

        // Set the var currentPage to the new page
        currentPage = parseInt(paginationType);
    }
    else if (paginationType == 'previous') {
        obtainData("", "", "", `page=${currentPage - 1}`, `pageNum=${pageNumType}`);
        obtainTotalPage("", "", "", `page=${currentPage - 1}`, `pageNum=${pageNumType}`);

        // Set the var currentPage to the new page
        currentPage -= 1;
    }
    else if (paginationType == 'next') {
        obtainData("", "", "", `page=${currentPage + 1}`, `pageNum=${pageNumType}`);
        obtainTotalPage("", "", "", `page=${currentPage + 1}`, `pageNum=${pageNumType}`);

        // Set the var currentPage to the new page
        currentPage += 1;
    };
};


/**
 * @function Implementing sorting functionality in the basic data viewer table
 * 
 * @param {int} pageNumType 
 */
function pageNum(pageNumType) {
    obtainData("", "", "", `page=${currentPage}`, `pageNum=${pageNumType}`);
    obtainTotalPage("", "", "", `page=${currentPage}`, `pageNum=${pageNumType}`);
};
