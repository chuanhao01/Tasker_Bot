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



describe("Test ajax call for basic data viewer", () => {
    it("Perform an ajax call and respond with mock data", () => {
        // Enabling response stubbing
        cy.server();

        // Reroute the request and respond with a pre-determined mock data ( ../fixtures/data.json )
        cy.fixture('data').then((data) => {
            cy.route('GET', '/basic/data?*', data).as('basicData')
        });

        // Use a random functionality that will perform an ajax call
        cy.visit("http://127.0.0.1:8080/index.html");

        // Wait for the backend routing to finish and provide assertions for the expected data
        cy.wait('@basicData').its('responseBody')
          .should('be.an', 'object')
          .and('not.empty')
    });
});


describe("Test ajax call for basic data viewer", () => {
    it("Perform an ajax call and respond with mock data", () => {
        // Enabling response stubbing
        cy.server();

        // Reroute the request and respond with a pre-determined mock data ( ../fixtures/data.json )
        cy.fixture('data').then((data) => {
            cy.route('GET', '/advance/data?*', data).as('advanceData')
        });

        // Use a random functionality that will perform an ajax call
        cy.visit("http://127.0.0.1:8080/advanced_data.html");

        // Wait for the backend routing to finish and provide assertions for the expected data
        cy.wait('@advanceData').its('responseBody')
          .should('be.an', 'object')
          .and('not.empty')
    });
});