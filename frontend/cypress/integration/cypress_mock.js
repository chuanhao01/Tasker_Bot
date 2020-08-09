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


describe("Integration testing for data viewer - basic", () => {
    var url = `${baseUrl}/index.html`
    var dataResult_type = 'data';

    it("Perform an ajax call with default params and responds with pre-determined mock data", () => {
        cy.stubBackend(url, "basic", dataResult_type, 'basicData');
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - basic; projectId", () => {
        /* ProjectId */

        // Equal to
        cy.checkFilterFeature(url, "basic", dataResult_type, "projectId", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(url, "basic", dataResult_type, "projectId", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(url, "basic", dataResult_type, "projectId", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - basic; duration", () => {
         /* duration */

        // Equal to
        cy.checkFilterFeature(url, "basic", dataResult_type, "duration", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(url, "basic", dataResult_type, "duration", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(url, "basic", dataResult_type, "duration", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the pageNum feature is able to provide the accurate url - basic", () => {
        var pageNum = 5;
        cy.checkPageNumFeature(url, "basic", dataResult_type, pageNum);
    });
});


describe("Integration testing for data viewer - advance", () => {
    var url = `${baseUrl}/advanced_data.html`;
    var dataResult_type = 'data';

    it("Perform an ajax call with default params and responds with pre-determined mock data", () => {
        cy.stubBackend(url, "advance", dataResult_type, 'advanceData');
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - advance; projectId", () => {
        /* ProjectId */

        // Equal to
        cy.checkFilterFeature(url, "advance", dataResult_type, "projectId", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(url, "advance", dataResult_type, "projectId", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(url, "advance", dataResult_type, "projectId", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the filter feature is able to provide the accurate url - advance; duration", () => {
         /* duration */

        // Equal to
        cy.checkFilterFeature(url, "advance", dataResult_type, "duration", "Equal to", "19999999");

        // Less than
        cy.checkFilterFeature(url, "advance", dataResult_type, "duration", "Less than", "0");

        // Greater than
        cy.checkFilterFeature(url, "advance", dataResult_type, "duration", "Greater than", "10");
    });

    it("Uses a cypress command to ensure that the pageNum feature is able to provide the accurate url - advance", () => {
        var pageNum = 5;
        cy.checkPageNumFeature(url, "advance", dataResult_type, pageNum);
    });
});


describe("Integration testing for result viewer - basic", () => {
    var url = `${baseUrl}/basic_results.html`;

    it("Perform an ajax call with default params and responds with pre-determined mock data", () => {
        cy.visit(url);

        // Defining query params
        var arg_projectId = 'projectId=1100000001';
        var arg_startDate = 'startDate=2020/01/01';
        var arg_startTime = 'startTime=0900'

        // Enable response stubbing
        cy.server();

        // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
        cy.fixture('basic_result').then((resultData) => {
            cy.route('GET', `/basic/result?${arg_projectId}&${arg_startDate}&${arg_startTime}`, resultData).as('basicResult');
        });

        // Fill in the input fields and compute
        cy.get('#compute_projectId').type(arg_projectId.split('=')[1]);
        cy.get('#compute_startDate').type(arg_startDate.split('=')[1]);
        cy.get('#compute_startTime').type(arg_startTime.split('=')[1]);

        cy.get('#computeBtn').click();

        // Wait for the routing to finish and the mock response to be sent before obtaining the url
        cy.wait('@basicResult');
        cy.get('@basicResult').then(function (xhr) {
            var requestUrl = xhr.xhr.url;
            console.log('url: ' + requestUrl);

            var filterArg_projectId = requestUrl.split('?')[1].split('&')[0];
            var filterArg_startDate = requestUrl.split('?')[1].split('&')[1];
            var filterArg_startTime = requestUrl.split('?')[1].split('&')[2];
        
            expect(filterArg_projectId).to.equal(arg_projectId);
            expect(filterArg_startDate).to.equal(arg_startDate);
            expect(filterArg_startTime).to.equal(arg_startTime);
        });
    });

    it("Performs another ajax call to check whether multiple computations can be made without reloading the page", () => {
        // Defining query params
        var arg_projectId = 'projectId=1';
        var arg_startDate = 'startDate=2000/09/01';
        var arg_startTime = 'startTime=1200'

        // Enable response stubbing
        cy.server();

        // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
        cy.fixture('basic_result').then((resultData) => {
            cy.route('GET', `/basic/result?${arg_projectId}&${arg_startDate}&${arg_startTime}`, resultData).as('basicResult');
        });

        // Clear the input fields
        cy.get('#compute_projectId').clear()
        cy.get('#compute_startDate').clear()
        cy.get('#compute_startTime').clear()

        // Fill in the input fields and compute
        cy.get('#compute_projectId').type(arg_projectId.split('=')[1]);
        cy.get('#compute_startDate').type(arg_startDate.split('=')[1]);
        cy.get('#compute_startTime').type(arg_startTime.split('=')[1]);

        cy.get('#computeBtn').click();

        // Wait for the routing to finish and the mock response to be sent before obtaining the url
        cy.wait('@basicResult');
        cy.get('@basicResult').then(function (xhr) {
            var requestUrl = xhr.xhr.url;
            console.log('url: ' + requestUrl);

            var filterArg_projectId = requestUrl.split('?')[1].split('&')[0];
            var filterArg_startDate = requestUrl.split('?')[1].split('&')[1];
            var filterArg_startTime = requestUrl.split('?')[1].split('&')[2];
        
            expect(filterArg_projectId).to.equal(arg_projectId);
            expect(filterArg_startDate).to.equal(arg_startDate);
            expect(filterArg_startTime).to.equal(arg_startTime);
        });
    });
});


describe("Integration testing for result viewer - basic", () => {
    var url = `${baseUrl}/advanced_results.html`;

    it("Perform an ajax call with default params and responds with pre-determined mock data", () => {
        cy.visit(url);

        // Defining query params
        var arg_projectId = 'projectId=1004';

        // Enable response stubbing
        cy.server();

        // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
        cy.fixture('advance_result').then((resultData) => {
            cy.route('GET', `/advance/result?${arg_projectId}`, resultData).as('advanceResult');
        });

        // Fill in the input fields and compute
        cy.get('#compute_projectId').type(arg_projectId.split('=')[1]);

        cy.get('#computeBtn').click();

        // Wait for the routing to finish and the mock response to be sent before obtaining the url
        cy.wait('@advanceResult');
        cy.get('@advanceResult').then(function (xhr) {
            var requestUrl = xhr.xhr.url;
            console.log('url: ' + requestUrl);

            var filterArg_projectId = requestUrl.split('?')[1].split('&')[0];
        
            expect(filterArg_projectId).to.equal(arg_projectId);
        });
    });

    it("Performs another ajax call to check whether multiple computations can be made without reloading the page", () => {
        // Defining query params
        var arg_projectId = 'projectId=9999';

        // Enable response stubbing
        cy.server();

        // Reroute request and respond with pre-determined mock data (../fixtures/data.json)
        cy.fixture('advance_result').then((resultData) => {
            cy.route('GET', `/advance/result?${arg_projectId}`, resultData).as('advanceResult');
        });

        // Clear the input field
        cy.get('#compute_projectId').clear()

        // Fill in the input field and compute
        cy.get('#compute_projectId').type(arg_projectId.split('=')[1]);

        cy.get('#computeBtn').click();

        // Wait for the routing to finish and the mock response to be sent before obtaining the url
        cy.wait('@advanceResult');
        cy.get('@advanceResult').then(function (xhr) {
            var requestUrl = xhr.xhr.url;
            console.log('url: ' + requestUrl);

            var filterArg_projectId = requestUrl.split('?')[1].split('&')[0];
        
            expect(filterArg_projectId).to.equal(arg_projectId);
        });
    })
})