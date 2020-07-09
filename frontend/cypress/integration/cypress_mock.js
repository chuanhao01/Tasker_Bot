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
        cy.stubBackend("http://127.0.0.1:8080/index.html", "basic", "data")
    });
});


describe("Test ajax call for advanced data viewer", () => {
    it("Perform an ajax call and respond with mock data", () => {
        cy.stubBackend("http://127.0.0.1:8080/advanced_data.html", "advance", "data")
    });
});