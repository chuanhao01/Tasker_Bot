/**
 * @fileoverview This file is the code for Cypress unit testing. 
 * To run, cd to frontend and run the cmd '..\node_modules\.bin\cypress open' in the terminal
 * 
 * Note that this file makes tests with the same 10 rows of data where the only difference is an incremental * taskId
 * 
 * @author Sherisse Tan
 * 
 * @requires NPM:Cypress
 * @requires allFunctions (frontend/files/functions.js)
 */

// Import all the functions that we are using for the frontend
const allFunctions = require('../../files/functions.js');
var numDataRows = 10;

// Catch any uncaught errors which likely results from application code and not Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
    console.log("err :" + err);
    console.log("runnable :" + runnable);
    return false;
});



describe("Load the basic data and result viewer", () => {
    it("Checks whether the webpages loads properly", () => {
        cy.visit("http://127.0.0.1:8080/index.html");

        // Check that the pop-up form is automatically hidden
        cy.get('#insert_editModal').should('not.be.visible');

        // Click the add new btn to reveal the pop-up form
        cy.get('#addNewBtn').click();

        // Check that the pop-up form is now visible after clicking and that the close button works properly
        cy.get('#insert_editModal').should('be.visible');
        cy.get('#addNewTask_closeBtn').click()
        cy.get('#insert_editModal').should('not.be.visible');


        // Navigate to the result viewer page
        cy.get('#resultNav').should('have.attr', 'href')
                            .then((href) => {
                                cy.visit(`http://127.0.0.1:8080/${href}`);
                            });

        // Check that the table and chart are visible
        cy.get('#resultTable').should('be.visible');
        cy.get('#resultChart').should('be.visible');


        // Return to the basic data viewer (homepage -> index.html)
        cy.visit("http://127.0.0.1:8080/index.html");
        cy.wait(2000);
    });
});


describe("Unit testing for frontend insert task with mock data", () => {
    it("Tests whether the insertion of tasks works correctly, inserting the correct data", () => {
        // Fake data
        var ftaskID = "1";
        var fprojectID = "10";
        var fdueDate = "2020/05/05";
        var fdueTime = "1200";
        var fduration = "0";

        // Test whether the data submitted and being "inserted" is correct
        var newData = allFunctions.edit_insertTask(ftaskID, fprojectID, fdueDate, fdueTime, fduration);
        var successfulInsert;

        if (newData.taskID != ftaskID || 
            newData.projectID != fprojectID ||
            newData.dueDate != fdueDate ||
            newData.dueTime != fdueTime ||
            newData.duration != fduration) {
                successfulInsert = false;
            }
        else {
            successfulInsert = true;
        };

        // Check whether the data was inserted successfully as a Cypress test
        // Cypress test passes if the data was inserted successfully
        // Cypress test fails if the data was not inserted successfully
        expect(successfulInsert).to.equal(true);
    });
});


describe("Check whether the navigation works", () => {
    it("Clicks the navigation links and checks that the new page is correct", () => {
        var successfulNavigation;
    
        cy.get('#resultNav').should('have.attr', 'href')
                            .then((href) => {
                                cy.visit(`http://127.0.0.1:8080/${href}`);
                            });


        cy.get('#homeNav').should('have.attr', 'href')
                            .then((href) => {
                                cy.visit(`http://127.0.0.1:8080/${href}`);
                            });
    });
});


describe("Checks whether the GET data is working -> dataViewerTable", () => {
    it("Checks to see whether the data viewer table is empty", () => {
        // Checks that the table has rows ('tr')
        cy.get('#tableBody').children('tr').then(($tr) => {
            // Expecting there to be 10 rows of data (DEV)
            expect($tr).to.have.length(numDataRows); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(numDataRows * 7);
        });
    });
});


describe("Checks whether the GET data is working -> pageNum", () => {
    it("Changes the pageNum and checks whether the number of rows of data changes accordingly", () => {
        // Changing the pageNum for the purpose of this test
        numDataRows = 5;

        // Fills in the pageNum input and presses 'enter'
        cy.get('#input_pageNum').type(`${numDataRows}{enter}`);
        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish

        // Repeats the same test for the dataViewerTable but with the new pageNum
        cy.get('#tableBody').children('tr').then(($tr) => {
            expect($tr).to.have.length(numDataRows); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(numDataRows * 7);
        });
    });
});


describe("Checks whether the GET data is working -> Filtering projectId", () => {
    it("Gives an equation to filter all the data by and checks that the filter works appropriately", () => {
        // Refresh the data in the dataViewerTable
        numDataRows = 10;
        cy.get('#input_pageNum').type(`${numDataRows}{enter}`);
        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish
        
        var maxNum = 20;
        var minNum = 10;

        // Selects 'projectId' in the dropdown for the filter attribute and run through diff filters
        cy.get('#filterAttribute').select('projectId').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('11');
            cy.get('#filterBtn').click();

            // Check that all remaining data has projectId = 11
            cy.get('#projectId_data').should(($th) => {
                expect($th).to.contain('11');
            });

            // Check that there is no data (table should only have 1 element -> column attributes)
            cy.get('#filterInput').clear();
            cy.get('#filterInput').type(`${minNum}`);
            cy.get('#filterBtn').click();
            cy.get('#tableBody').should(($tableBody) => {
                expect($tableBody).to.have.length(1);
            });


            // Check filterOperation == 'Greater than'
            cy.get('#filterInput').clear();
            cy.get('#filterOperation').select('Greater than');
            cy.get('#filterInput').type(`${minNum}`);
            cy.get('#filterBtn').click();  
            
            // Check that all remaining data has projectId > 10
            cy.get('#projectId_data').should(($th) => {
                var dataValue = parseInt($th.text());
                expect(dataValue).to.be.greaterThan(minNum);
            });

            // Check that there is no data
            cy.get('#filterInput').clear();
            cy.get('#filterInput').type(`${maxNum}`);
            cy.get('#filterBtn').click();
            cy.get('#tableBody').should(($tableBody) => {
                expect($tableBody).to.have.length(1);
            });


            // Check filterOperation == 'Less than'
            cy.get('#filterInput').clear();
            cy.get('#filterOperation').select('Less than');
            cy.get('#filterInput').type(`${maxNum}`);
            cy.get('#filterBtn').click();  
            
            // Check that all remaining data has projectId < 20
            cy.get('#projectId_data').should(($th) => {
                var dataValue = parseInt($th.text());
                expect(dataValue).to.be.lessThan(maxNum);
            });

            // Check that there is no data
            cy.get('#filterInput').clear();
            cy.get('#filterInput').type(`${minNum}`);
            cy.get('#filterBtn').click();
            cy.get('#tableBody').should(($tableBody) => {
                expect($tableBody).to.have.length(1);
            })
        });
    });
});


describe("Checks whether the GET data is working -> Filtering duration", () => {
    it("Gives an equation to filter all the data by and checks that the filter works appropriately", () => {
        // Refresh the data in the dataViewerTable
        cy.get('#input_pageNum').type(`${numDataRows}{enter}`);
        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish
        
        var maxNum = 3;
        var minNum = 1;

        // Selects 'projectId' in the dropdown for the filter attribute and run through diff filters
        cy.get('#filterAttribute').select('duration').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('2');
            cy.get('#filterBtn').click();

            // Check that all remaining data has projectId = 2
            cy.get('#duration_data').should(($th) => {
                expect($th).to.contain('2');
            });

            // Check that there is no data (table should only have 1 element -> column attributes)
            cy.get('#filterInput').clear();
            cy.get('#filterInput').type(`${minNum}`);
            cy.get('#filterBtn').click();
            cy.get('#tableBody').should(($tableBody) => {
                expect($tableBody).to.have.length(1);
            });


            // Check filterOperation == 'Greater than'
            cy.get('#filterInput').clear();
            cy.get('#filterOperation').select('Greater than');
            cy.get('#filterInput').type(`${minNum}`);
            cy.get('#filterBtn').click();  
            
            // Check that all remaining data has projectId > 1
            cy.get('#duration_data').should(($th) => {
                var dataValue = parseInt($th.text());
                expect(dataValue).to.be.greaterThan(minNum);
            });

            // Check that there is no data
            cy.get('#filterInput').clear();
            cy.get('#filterInput').type(`${maxNum}`);
            cy.get('#filterBtn').click();
            cy.get('#tableBody').should(($tableBody) => {
                expect($tableBody).to.have.length(1);
            });


            // Check filterOperation == 'Less than'
            cy.get('#filterInput').clear();
            cy.get('#filterOperation').select('Less than');
            cy.get('#filterInput').type(`${maxNum}`);
            cy.get('#filterBtn').click();  
            
            // Check that all remaining data has projectId < 3
            cy.get('#duration_data').should(($th) => {
                var dataValue = parseInt($th.text());
                expect(dataValue).to.be.lessThan(maxNum);
            });

            // Check that there is no data
            cy.get('#filterInput').clear();
            cy.get('#filterInput').type(`${minNum}`);
            cy.get('#filterBtn').click();
            cy.get('#tableBody').should(($tableBody) => {
                expect($tableBody).to.have.length(1);
            })
        });
    });
});