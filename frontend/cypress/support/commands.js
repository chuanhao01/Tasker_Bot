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
    var type = `${basicAdvance}_${dataResult}`;


    // Enable response stubbing
    cy.server()

    // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
    cy.fixture('data').then((data) => {
        cy.route('GET', `/${basicAdvance}/${dataResult}?*`, data).as(`${type}`);
    });

    // Visit a relevant page that will call the rerouted backend
    cy.visit(url);

    // Ensure that a response has been provided from the rerouted backend and provide assertions for said response
    cy.wait(`@${type}`).its('responseBody')
      .should('be.an', 'object')
      .and('not.empty');
});


Cypress.Commands.add("checkFilterFeature", (url, basicAdvance, dataResult, filterAttribute, filterOperation, filterInput) => {
    // Visit a relevant page that has the filter feature
    cy.visit(url);

    // Enable response stubbing
    cy.server()


    // Ajax call with arguments provided
    cy.get('#filterAttribute').select(`${filterAttribute}`)
    cy.get('#filterOperation').select(`${filterOperation}`);
    cy.get('#filterInput').type(`${filterInput}`);

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

    // Defining the appropriate filter argument that should be passed in
    var testArg = `${filterAttribute}[${filterOperation}]=${filterInput}`;


    // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
    cy.fixture('data').then((data) => {
        cy.route('GET', `/${basicAdvance}/${dataResult}?*`, data).as('filterFeature');
    });

    cy.get('#filterBtn').click();

    // Wait for the routing to finish and the mock response to be sent before obtaining the url
    cy.wait('@filterFeature');
    cy.get('@filterFeature').then(function (xhr) {
        var requestUrl = xhr.xhr.url;
        console.log('url: ' + requestUrl);

        var filterArg = requestUrl.split('?')[1].split('&')[0];
        expect(filterArg).to.equal(testArg);
    });
});