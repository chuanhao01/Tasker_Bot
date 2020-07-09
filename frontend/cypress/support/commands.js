/**
 * @fileoverview This file contains all the Cypress Commands that will be used in either cypress_mock.js or cypress_spec.js
 * 
 * @author Sherisse Tan
 * 
 * @requires NPM:Cypress
 */


/**
 * @param {string} url  A string containing the url of the html page that will automatically perform an ajax call when navigated to
 * @param {string} basicAdvance A string that contains either 'basic' or 'advance'
 * @param {string} dataResult   A string that contains either 'data' or 'result'
 */
Cypress.Commands.add("stubBackend", (url, basicAdvance, dataResult) => {
    // Enable response stubbing
    cy.server()

    // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
    cy.fixture('data').then((data) => {
        cy.route('GET', `/${basicAdvance}/${dataResult}?*`, data).as(`${basicAdvance}_${dataResult}`);
    });

    // Visit a relevant page that will call the rerouted backend
    cy.visit(url);

    // Ensure that a response has been provided from the rerouted backend and provide assertions for said response
    cy.wait(`@${basicAdvance}_${dataResult}`).its('responseBody')
      .should('be.an', 'object')
      .and('not.empty');
});