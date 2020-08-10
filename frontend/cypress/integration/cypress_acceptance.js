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
var numDataRows = 10;


describe("Acceptance test for basic dataViewer", () => {
    it("Calls the backend with default params and ensures that the backend returns the correct data", () => {
        cy.visit(`${baseUrl}/index.html`);

        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish

        cy.get('#basic_tableBody').children('tr').then(($tr) => {
            // Expecting there to be 10 rows of data in each page
            expect($tr).to.have.length(numDataRows); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(numDataRows * 7);
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

    it("Changes the pageNum to 5", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/index.html`);

        // Changing the pageNum for the purpose of this test
        numDataRows = 5;

        // Fills in the pageNum input and presses 'enter'
        cy.get('#input_pageNum').type(`${numDataRows}{enter}`);
        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish

        // Repeats the same test for the dataViewerTable but with the new pageNum
        cy.get('#basic_tableBody').children('tr').then(($tr) => {
            expect($tr).to.have.length(numDataRows); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(numDataRows * 7);
        });
    });
});


describe("Acceptance test for advance dataViewer", () => {
    it("Calls the backend with default params and ensures that the backend returns the correct data", () => {
        cy.visit(`${baseUrl}/advanced_data.html`);

        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish

        // Reset numDataRows = 10
        numDataRows = 10

        cy.get('#advanced_tableBody').children('tr').then(($tr) => {
            // Expecting there to be 10 rows of data in each page
            expect($tr).to.have.length(numDataRows); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(numDataRows * 5);
        });
    });

    it("Filters the data by projectId[=]=102", () => {
        cy.get('#filterAttribute').select('projectId').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('102');
            cy.get('#filterBtn').click();

            // Check that all remaining data has projectId = 1100000002
            cy.get('#projectId_data').should(($th) => {
                expect($th).to.contain('102');
            });
        });
    });

    it("Filters the data by duration[=]=4", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/advanced_data.html`);

        // Clear the filter input field
        cy.get('#filterInput').clear();

        cy.get('#filterAttribute').select('duration').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('4');
            cy.get('#filterBtn').click();

            // Check that all remaining data has duration = 3
            cy.get('#duration_data').should(($th) => {
                expect($th).to.contain('4');
            });
        });
    });

    it("Filters the data by projectId[=]=102 && duration[=]=4", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/advanced_data.html`);
        
        // Perform a filter with projectId
        cy.get('#filterAttribute').select('projectId').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('102');
            cy.get('#filterBtn').click();
        });

        // Clear the filter input field
        cy.get('#filterInput').clear();

        // Proceed to perform a filter with duration without refreshing query params
        cy.get('#filterAttribute').select('duration').then(() => {
            // Check filterOperation == 'Equal to'
            cy.get('#filterOperation').select('Equal to');
            cy.get('#filterInput').type('4');
            cy.get('#filterBtn').click();
        });

        // Check that all remaining data has projectId = 1100000002
        cy.get('#projectId_data').should(($th) => {
            expect($th).to.contain('102');
        });

        // Check that all remaining data has duration = 3
        cy.get('#duration_data').should(($th) => {
            expect($th).to.contain('4');
        });
    });

    it("Changes the pageNum to 5", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/advanced_data.html`);

        // Changing the pageNum for the purpose of this test
        numDataRows = 5;

        // Fills in the pageNum input and presses 'enter'
        cy.get('#input_pageNum').type(`${numDataRows}{enter}`);
        cy.wait(2000); // Force a short waiting time to allow the ajax call to finish

        // Repeats the same test for the dataViewerTable but with the new pageNum
        cy.get('#advanced_tableBody').children('tr').then(($tr) => {
            expect($tr).to.have.length(numDataRows); 

            // Check that each row has 7 columns of data ('th')
            expect($tr.children()).to.have.length(numDataRows * 5);
        });
    });
});


describe("Acceptance test for basic resultViewer", () => {
    it("Provides some values for computation and checks the returned data", () => {
        // Visit the page -> refreshing the query params
        cy.visit(`${baseUrl}/basic_results.html`);

        cy.get('#compute_projectId').type('1100000004');
        cy.get('#compute_startDate').type('2020/01/01');
        cy.get('#compute_startTime').type('0900');
        cy.get('#computeBtn').click();

        // Force a waiting time
        cy.wait(2000);

        // Check that the computed data has a correct taskId
        cy.get('#taskId_data').should(($th) => {
            expect($th).to.contain('1000000013');
        });

        // Check that the computed data has at least the startDate
        cy.get('#fromDate_data').should(($th) => {
            expect($th).to.contain('2020/01/01')
        })

        // Check that the computed data has at least the startTime
        cy.get('#fromTime_data').should(($th) => {
            expect($th).to.contain('0900');
        });
    });

    it("Provides some values for computation and checks the returned data", () => {
        // Clear the input fields
        cy.get('#compute_projectId').clear();
        cy.get('#compute_startDate').clear();
        cy.get('#compute_startTime').clear();

        cy.get('#compute_projectId').type('1100000003');
        cy.get('#compute_startDate').type('2000/01/01');
        cy.get('#compute_startTime').type('1200');
        cy.get('#computeBtn').click();

        // Force a waiting time
        cy.wait(2000);

        // Check that the computed data has a correct taskId
        cy.get('#taskId_data').should(($th) => {
            expect($th).to.contain('1000000009');
        });

        // Check that the computed data has at least the startDate
        cy.get('#fromDate_data').should(($th) => {
            expect($th).to.contain('2000/01/01')
        })

        // Check that the computed data has at least the startTime
        cy.get('#fromTime_data').should(($th) => {
            expect($th).to.contain('1200');
        });
    });
})