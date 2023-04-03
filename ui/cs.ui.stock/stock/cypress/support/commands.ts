/// <reference types="cypress" />

Cypress.Commands.add("openForm", (form) => {
    cy.get('#app')
        .contains(`${form}`)
            .click()
    cy.get('div[role="dialog"]')
})


Cypress.Commands.add("fillForm", (key, value, expected) => {

  cy.get('div')
    .contains(`${key}`)
    .closest('div')
    .within(() => {
        const inputElement = cy.get('input')
        .then(input => {
          if (!input.val()) {
            inputElement
              .type(value)
              .invoke('val')
              .then(value => {
                expect(value).to.eq(expected)
              })
          }
          else { (input.val()) 
            inputElement
              .invoke('val')
              .then(value => {
                expect(value).to.eq(expected)
              })
          }
        })
    })
})

Cypress.Commands.add("filllogin", () => {
  cy.wait(500)
  const { username,password } = Cypress.env()
  cy.get('#username').type(username)
  cy.get('#password').type(password, {log: false})
  cy.get('#loginButton').click()
  cy.wait(1000)
  
})
