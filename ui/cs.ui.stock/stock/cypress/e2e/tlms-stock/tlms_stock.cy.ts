/// <reference types="cypress" />

import {
  MOCK_CONFIGURATION_FIELDS
} from '../../../src/test-utils/mock-data/configuration-types'

export const allButtons = [
  'New',
  'New from file',
  'Edit',
  'Change state',
  'Save to file',
  'Load from file',
]

describe('First TLMS Stock suite', () => {

  // host variable comes from cypress.env.json
  const { host } = Cypress.env()

  beforeEach(() => {
    cy.visit(host)
    cy.wait(2000)
  });

  it('First TLMS Stock test', () => {
    cy.get('#app')
      .within(() => {

        // Checking if title is correct
        cy.title()
          .should('contain', 'Terminal Stock Application')

        // Checking if background color is correct
        cy.get('header')
          .should('have.css', 'background-color', 'rgb(7, 29, 73)')
          .within(() => {
            cy.contains('tlms stock').should('exist')
          })

        // Check Toolbar buttons
        allButtons.map((label) => cy.contains(label).should('exist'))

        // Check Toolbar input
        cy.contains('IN-STOCK only').should('exist')

        // Check table elements
        const tableElements = MOCK_CONFIGURATION_FIELDS.map(el => ({ name: el.name }))
        tableElements.map((label) => cy.contains(label.name).should('exist'))

        // Check body rows
        cy.get('tbody')
          .within(() => {
            cy.get('tr').should('be.visible')
          })

      });
  });
});
