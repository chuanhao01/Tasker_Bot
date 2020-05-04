describe("Cypress unit testing", function () {
    it("is a test", function () {
        expect(true).to.equal(true)

        cy.visit("http://192.168.1.141:8080")
    })
})