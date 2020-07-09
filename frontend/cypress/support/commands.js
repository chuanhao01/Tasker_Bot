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
})