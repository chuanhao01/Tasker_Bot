/**
 * @fileoverview This file contains all the Cypress Commands that will be used in either cypress_mock.js or cypress_spec.js
 * 
 * @author Sherisse Tan
 * 
 * @requires NPM:Cypress
 */


/**
 * @function Stub any backend request and return a fixed data JSON object from fixtures/data.json
 * 
 * @param {string} url  A string containing the url of the html page that will automatically perform an ajax call when navigated to
 * @param {string} basicAdvance A string that contains either 'basic' or 'advance'
 * @param {string} dataResult   A string that contains either 'data' or 'result'
 * @param {string} featureType  A string denoting what type of feature being tested
 */
Cypress.Commands.add("stubBackend", (url, basicAdvance, dataResult, featureType) => {
    // Enable response stubbing
    cy.server()

    // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
    cy.fixture('data').then((data) => {
        cy.route('GET', `/${basicAdvance}/${dataResult}?*`, data).as(`${featureType}`);
    });

    // Visit a relevant page that will call the rerouted backend
    cy.visit(url);
});


/**
 * @function 
 * 
 * @param {string} url  A string containing the url of the html page that will automatically perform an ajax call when navigated to
 * @param {string} basicAdvance A string that contains either 'basic' or 'advance'
 * @param {string} dataResult   A string that contains either 'data' or 'result'
 * @param {string} filterAttribute A string denoting whether the filter attribute is 'projectId' or 'duration
 * @param {string} filterOperation A string denoting whether the filter input is '>', '<' or '='
 * @param {string} filterInput A string denoting what the value of the equation is
 */
Cypress.Commands.add("checkFilterFeature", (url, basicAdvance, dataResult, filterAttribute, filterOperation, filterInput) => {
    var featureType = 'filter'
    cy.stubBackend(url, basicAdvance, dataResult, featureType);

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
    else if (filterOperation == 'Less than') {
        filterOperation = '<'
    }

    // Defining the appropriate filter argument that should be passed in
    var testArg = `${filterAttribute}[${filterOperation}]=${filterInput}`;;

    cy.get('#filterBtn').click();

    // Wait for the routing to finish and the mock response to be sent before obtaining the url
    cy.wait(`@${featureType}`);
    cy.get(`@${featureType}`).then(function (xhr) {
        var requestUrl = xhr.xhr.url;
        var filterArg = '';
        //console.log('url: ' + requestUrl);

        if (filterAttribute == 'projectId') {
            filterArg = requestUrl.split('?')[1].split('&')[0];
        }
        else if (filterAttribute == 'duration') {
            filterArg = requestUrl.split('?')[1].split('&')[1];
        }
        
        expect(filterArg).to.equal(testArg);
    });
});

