/**
 * @fileoverview This file is the code for Cypress unit testing that mocks the backend.
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