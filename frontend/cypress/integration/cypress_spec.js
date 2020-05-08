// Import all the functions that we are using for the frontend
const functions = require('../../files/functions.js');

// Catch any uncaught errors which likely results from application code and not Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
    console.log("err :" + err)
    console.log("runnable :" + runnable)
    return false
})

describe("Load the page", () => {
    it("Checks whether the html page loads properly", () => {
        cy.visit("http://192.168.1.141:8080/files/");

        // Check that the pop-up form is automatically hidden
        cy.get('#addNewTaskModal').should('not.be.visible');
    });
});

describe("Unit testing for frontend insert task", () => {
    it("Tests whether the insertion of tasks works correctly, inserting the correct data", () => {
        // Click the add new btn to reveal the pop-up form
        cy.get('#addNewBtn').click();

        // Check that the pop-up form is now visible after clicking and that the close button works properly
        cy.get('#addNewTaskModal').should('be.visible');
        cy.get('#addNewTask_closeBtn').click()
        cy.get('#addNewTaskModal').should('not.be.visible');

        // Fake data
        var ftaskID = "1";
        var fprojectID = "10";
        var fdueDate = "2020/05/05";
        var fdueTime = "1200";
        var fduration = "0";

        // Test whether the data submitted and being "inserted" is correct
        var insertedData = functions.insertTask(ftaskID, fprojectID, fdueDate, fdueTime, fduration);
        console.log(insertedData)

        if (insertedData.taskID != ftaskID || 
            insertedData.projectID != fprojectID ||
            insertedData.dueDate != fdueDate ||
            insertedData.dueTime != fdueTime ||
            insertedData.duration != fduration) {
                // Manually throw an error to fail the Cypress test
                expect(true).to.equal(false);
            }
        else {
            expect(true).to.equal(true);
        };
    });
});