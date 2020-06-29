/**
 * @fileoverview This file deals with the various functions that will affect DOM elements in the HTML file
 * 
 * @author Sherisse Tan
 */


 // Define all the default starting variables needed for the API -> This will be updated as the user performs actions in the website
 var currentPage = 1;
 var pageNumType = 10;
 var sortType = '';

 let currentFilters = {
     'projectId': '',
     'duration': ''
 };

 
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

    // Defining the string to input into tht url to filter
    let filterString = `${filterAttribute}[${filterOperation}]=${filterInput}`;
    // Replacing the value in the object to the new filter attribute
    currentFilters[filterAttribute] = filterString;


    // Reset currentPage to display 1st page after each filter
    currentPage = 1;

    // Ajax calls
    basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${currentPage}`, `pageNum=${pageNumType}`, '');
 };

 /**
  * @function Implementing filter reset functionality
  */
 function resetFilter() {
     // Reset values in object to empty strings
     currentFilters['duration'] = '';
     currentFilters['projectId'] = '';

     // Ensure that the user is brought back to the first page
     currentPage = 1;

     // Ajax call
     basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${currentPage}`, `pageNum=${pageNumType}`, '');
 };


/**
 * @function Implementing sorting functionality in the basic data viewer table - not persistent
 * 
 * @param {object} eventTarget 
 */
function sort(eventTarget) {
    // Obtain whether the column is already sorted in ascending order or descending order
    var currentSort = eventTarget.className.split(' ')[eventTarget.className.split(' ').length - 1];

    // Obtain the column name to be sorted by checking the id
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
    
    basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${currentPage}`, `pageNum=${pageNumType}`, `sortBy=${sortType}`);
};


/**
 * @function Implementing pagination functionality in the basic data viewer table
 * 
 * @param {string} pageLinkId 
 */
function pagination(pageLinkId) {
    var paginationType;
    paginationType = pageLinkId.split('_')[1];
        
    // In the event that the page-link clicked is not 'previous' or 'next', i.e. is one of the numbered links
    if (paginationType != 'previous' && paginationType != 'next') {
        basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${paginationType}`, `pageNum=${pageNumType}`, "");

        // Set the var currentPage to the new page
        currentPage = parseInt(paginationType);
    }

    else if (paginationType == 'previous') {
        // Set the var currentPage to the new page
        currentPage -= 1;

        basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${currentPage}`, `pageNum=${pageNumType}`, "");
    }

    else if (paginationType == 'next') {
        // Set the var currentPage to the new page
        currentPage += 1;
        
        basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${currentPage}`, `pageNum=${pageNumType}`, "");
    };
};


/**
 * @function Implementing pageNum size change functionality in the basic data viewer table
 * 
 * @param {int} pageNumType 
 */
function pageNum(pageNumType) {
    basic_obtainData(currentFilters['projectId'], currentFilters['duration'], `page=${currentPage}`, `pageNum=${pageNumType}`, "");
};
