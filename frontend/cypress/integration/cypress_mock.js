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


const baseUrl = "http://127.0.0.1:8080";


describe("Integration testing for data viewer - basic & advance", () => {
    var dataResult_type = 'data';

    it("Perform an ajax call with default params and responds with pre-determined mock data", () => {
        cy.stubBackend(`${baseUrl}/index.html`, "basic", dataResult_type, 'basicData');
        cy.stubBackend(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, 'advanceData');
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - basic; projectId", () => {
        /* ProjectId */

        // Equal to
        cy.checkFilterFeature(`${baseUrl}/index.html`, "basic", dataResult_type, "projectId", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(`${baseUrl}/index.html`, "basic", dataResult_type, "projectId", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(`${baseUrl}/index.html`, "basic", dataResult_type, "projectId", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - basic; duration", () => {
         /* duration */

        // Equal to
        cy.checkFilterFeature(`${baseUrl}/index.html`, "basic", dataResult_type, "duration", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(`${baseUrl}/index.html`, "basic", dataResult_type, "duration", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(`${baseUrl}/index.html`, "basic", dataResult_type, "duration", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the pageNum feature is able to provide the accurate url - basic", () => {
        var pageNum = 5;
        cy.checkPageNumFeature(`${baseUrl}/index.html`, "basic", dataResult_type, pageNum);
    })

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - advance; projectId", () => {
        /* ProjectId */

        // Equal to
        cy.checkFilterFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, "projectId", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, "projectId", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, "projectId", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - advance; duration", () => {
         /* duration */

        // Equal to
        cy.checkFilterFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, "duration", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, "duration", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, "duration", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the pageNum feature is able to provide the accurate url - advance", () => {
        var pageNum = 5;
        cy.checkPageNumFeature(`${baseUrl}/advanced_data.html`, "advance", dataResult_type, pageNum);
    })
});