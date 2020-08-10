/**
 * @fileoverview This file is the code for Cypress acceptance testing.
 * 
 * @author Sherisse Tan
 * 
 * @requires NPM:Cypress
 * @requires allFunctions (frontend/files/functions.js)
 */


// Catch any uncaught errors which likely results from application code and not the Cypress tests
Cypress.on('uncaught:exception', (err, runnable) => {
    console.log("err :" + err);
    console.log("runnable :" + runnable);
    return false;
});


const baseUrl = "http://127.0.0.1:8080";


describe("Acceptance test for basic dataViewer", () => {
    it("Calls the backend with default params and ensures that the backend returns the correct data", () => {
        cy.visit(`${baseUrl}/index.html`);

        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish

        cy.get('#basic_tableBody').children('tr').then(($tr) => {
            // Expecting there to be 10 rows of data in each page
            expect($tr).to.have.length(10); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(70);
        });
    });

    it("Filters the data by projectId[=]=1100000002", () => {
        cy.get('#filterAttribute').select('projectId').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('1100000002');
            cy.get('#filterBtn').click();

            // Check that all remaining data has projectId = 1100000002
            cy.get('#projectId_data').should(($th) => {
                expect($th).to.contain('1100000002');
            });
        });
    });

    it("Filters the data by duration[=]=3", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/index.html`);

        // Clear the filter input field
        cy.get('#filterInput').clear();

        cy.get('#filterAttribute').select('duration').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('3');
            cy.get('#filterBtn').click();

            // Check that all remaining data has duration = 3
            cy.get('#duration_data').should(($th) => {
                expect($th).to.contain('3');
            });
        });
    });

    it("Filters the data by projectId[=]=1100000002 && duration[=]=3", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/index.html`);

        // Perform a filter with projectId
        cy.get('#filterAttribute').select('projectId').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('1100000002');
            cy.get('#filterBtn').click();
        });

        // Clear the filter input field
        cy.get('#filterInput').clear();

        // Proceed to perform a filter with duration without refreshing query params
        cy.get('#filterAttribute').select('duration').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('3');
            cy.get('#filterBtn').click();
        });

        // Check that all remaining data has projectId = 1100000002
        cy.get('#projectId_data').should(($th) => {
            expect($th).to.contain('1100000002');
        });

        // Check that all remaining data has duration = 3
        cy.get('#duration_data').should(($th) => {
            expect($th).to.contain('3');
        });
    });

})