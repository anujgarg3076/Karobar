/// <reference types="cypress" />

describe('Create new terminal', () => {
  // host variable comes from cypress.env.json
  const { host } = Cypress.env()

  beforeEach(() => {
    cy.visit(host)
    cy.wait(2000)
  })

  it('Create new terminal', () => {
    cy.fixture('new_terminal').then((data) => {
      const newTerminalForm = [
        { fieldLabel: 'Media type', value: '{enter}', expected: 'AMS-DEFAULT' },
        { fieldLabel: 'Serial number', value: data.serialNumber, expected: data.serialNumber },
        { fieldLabel: 'Name', value: '{clear}AMS Demo ATM', expected: 'AMS Demo ATM' },
        { fieldLabel: 'Model', value: data.model, expected: data.model },
        {
          fieldLabel: 'Inventory number',
          value: data.inventoryNumber,
          expected: data.inventoryNumber,
        },
        {
          fieldLabel: 'Additional info',
          value: data.additionalInfo,
          expected: data.additionalInfo,
        },
        { fieldLabel: 'Location', value: '{enter}', expected: 'Stock' },
        { fieldLabel: 'Vendor', expected: 'test vendor' },
      ]

      let trLength: any
      cy.get('tr')
        .its('length')
        .then((length) => {
          trLength = length
        })

      cy.openForm('New').within(() => {
        newTerminalForm.map(({ fieldLabel, value, expected }) => {
          cy.fillForm(fieldLabel, value, expected)
        })

        cy.get('button').contains('Save').click()
      })

      cy.wait(2000)
      cy.get('tr')
        .its('length')
        .then((newLength) => {
          expect(newLength).to.not.equal(trLength)
        })
    })
  })
})
