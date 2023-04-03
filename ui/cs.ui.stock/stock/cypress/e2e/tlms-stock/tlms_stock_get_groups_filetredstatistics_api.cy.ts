/// <reference types="cypress" />

const { host_vm } = Cypress.env()

describe('Terminal group statistics', () => {
  it('Should show correct group statistics for POS group', () => {

    cy.intercept(`${host_vm}/ri2_acq/rest/tlms/terminalTypes`).as('getData')
    cy.intercept(`${host_vm}/ri2_acq/rest/stock/terminals?*`).as('getTerminalsData')
    cy.visit(`${host_vm}/ri2_acq/apps/stock/index.jsp`)

    cy.filllogin()

    let groupData = {}
    let terminalTypesData = []

    //POS Group
    cy.wait('@getData').then((interception) => {
      const responseData = interception?.response?.body
      terminalTypesData = responseData.terminalTypes
      const groupInfo = responseData.terminalTypes.find((terminalType) => {
        return terminalType.group == 'POS'

      })
      groupData = groupInfo

    })
    cy.wait('@getTerminalsData').then((interception) => {
      const responseData = interception?.response?.body
      const groupTerminals = responseData.data.filter((terminal) => {
        return terminal.type == groupData.mediaType && terminal.state == 'INSTALLED'

      })
      cy.get('[role="tablist"]').within(() => {
        cy.contains('POS').click().within(() => {
          cy.get('> span').should('have.length', 3)

          const installedTerminals = responseData.data.filter((terminal) => {
            return terminal.type == groupData.mediaType && terminal.state == 'INSTALLED'
          })
          if (installedTerminals.length > 0) {
            cy.contains(`INSTALLED: ${installedTerminals.length}`).should('exist')
          }
          const uninstallingTerminals = responseData.data.filter((terminal) => {
            return terminal.type == groupData.mediaType && terminal.state == 'UNINSTALLING'

          })
          if (uninstallingTerminals.length > 0) {
            cy.contains(`UNINSTALLING: ${uninstallingTerminals.length}`).should('exist')
          }
          const instockTerminals = responseData.data.filter((terminal) => {
            return terminal.type == groupData.mediaType && terminal.state == 'IN-STOCK'

          })
          if (instockTerminals.length > 0) {
            cy.contains(`IN-STOCK: ${instockTerminals.length}`).should('exist')
          }
          const replaceTerminals = responseData.data.filter((terminal) => {
            return terminal.type == groupData.mediaType && terminal.state == 'REPLACE'

          })
          if (replaceTerminals.length > 0) {
            cy.contains(`REPLACE: ${replaceTerminals.length}`).should('exist')
          }
        })
      })

      //Default-Group
      cy.intercept(`${host_vm}/ri2_acq/rest/stock/terminals?*`).as('getTerminalsDataDefault')
      cy.get('[role="tablist"]').within(() => {
        cy.contains('DEFAULT').click().within(() => {
          cy.wait(2000)
          cy.wait('@getTerminalsDataDefault').then((interception) => {
            const groupInfoDefault = terminalTypesData.find((terminalType) => {
              return terminalType.group == 'DEFAULT'

            })
            const responseData = interception?.response?.body
            const groupDefaultTerminals = responseData.data.filter((terminal) => {
              return terminal.type == groupInfoDefault?.mediaType && terminal.state == 'INSTALLED'

            })
            cy.get('> span').should('have.length', 3)

            if (groupDefaultTerminals.length > 0) {
              cy.contains(`INSTALLED: ${groupDefaultTerminals.length}`).should('exist')
            }
            const uninstallingTerminals = responseData.data.filter((terminal) => {
              return terminal.type == groupInfoDefault?.mediaType && terminal.state == 'UNINSTALLING'

            })
            if (uninstallingTerminals.length > 0) {
              cy.contains(`UNINSTALLING: ${uninstallingTerminals.length}`).should('exist')
            }
            const instockTerminals = responseData.data.filter((terminal) => {
              return terminal.type == groupInfoDefault?.mediaType && terminal.state == 'IN-STOCK'

            })
            if (instockTerminals.length > 0) {
              cy.contains(`IN-STOCK: ${instockTerminals.length}`).should('exist')
            }
            const replaceTerminals = responseData.data.filter((terminal) => {
              return terminal.type == groupInfoDefault?.mediaType && terminal.state == 'REPLACE'

            })
            if (replaceTerminals.length > 0) {
              cy.contains(`REPLACE: ${replaceTerminals.length}`).should('exist')
            }
          })
        })
      })
    })
  })
})
