/**
 * @author Sherisse Tan
 * 
 * @requires NPM:Cypress
 * @requires allFunctions (frontend/files/functions.js)
 */

// Import all the functions that we are using for the frontend
const allFunctions = require('../../files/functions.js');

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
        cy.wait(1000);
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


describe("Check whether the GET data is working", () => {
    it("Checks to see whether the data viewer table is empty", () => {
        // Checks that the table has rows ('tr') and each row has data ('th')
        cy.get('#tableBody').children('tr').children('th');
    })
})