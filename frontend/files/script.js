/**
 * @fileoverview This file deals with the various functions that will affect DOM elements in the HTML file
 * 
 * @author Sherisse Tan
 */


 // Define all the default starting variables needed for the API -> This will be updated as the user performs actions in the website
 var currentPage = 1;
 var pageNumType = 10;
 var sortType = '';


 function filter() {};


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


function pagination() {};


function pageNum() {}''
