/// <reference types="cypress" />

import { MOCK_TERMINALS } from '../../../src/test-utils/mock-data/terminals'

const terminalsMockData = {
  data: MOCK_TERMINALS,
  status: {
    type: 'success',
    message: '',
  },
}

const { host_vm } = Cypress.env()

const sortData = (resData: Terminal[], direction: 'ASC' | 'DESC') => {
  const result: Terminal[] = [...resData]
  if (direction == 'DESC') return result.sort((a, b) => Number(a.id) - Number(b.id)).reverse()
  return result.sort((a, b) => Number(a.id) - Number(b.id))
}
describe('Sort functionality', () => {

  it('should render correctly', () => {
    cy.intercept('GET', `${host_vm}/ri2_acq/rest/stock/src/terminals*`, MOCK_TERMINALS)
    cy.visit(`${host_vm}/ri2_acq/apps/stock/index.jsp`)
    cy.filllogin()
    cy.get('tbody').children('tr').should('have.length', 30)
  })

  it('should sort table rows correctly', () => {
    cy.intercept('/ri2_acq/rest/stock/terminals*').as('getData')
    cy.intercept('/ri2_acq/rest/stock/terminals?start=0&size=50&filters=type%3D%3D**&sorting=%5B%7B%22id%22%3A%22id%22%2C%22desc%22%3Atrue%7D%5D').as('getDataDesc')
    cy.intercept('/ri2_acq/rest/stock/terminals?start=0&size=50&filters=type%3D%3D**&sorting=%5B%7B%22id%22%3A%22id%22%2C%22desc%22%3Afalse%7D%5D').as('getDataAsc')
    cy.visit(`${host_vm}/ri2_acq/apps/stock/index.jsp`)
    cy.filllogin()
    cy.get('[title="Media Id"]').click()
    // get descending data
    cy.wait('@getDataDesc').then((interception) => {
      const responseData = interception?.response?.body
      const sortedData = sortData(responseData.data, 'DESC')
      expect(JSON.stringify(responseData.data) === JSON.stringify(sortedData)).to.be.true
    })

    cy.get('[title="Media Id"]').click()
    //get ascending data
    cy.wait('@getDataAsc').then((interception) => {
      const responseData = interception?.response?.body
      const sortedData = sortData(responseData.data, 'ASC')
      expect(JSON.stringify(responseData.data) === JSON.stringify(sortedData)).to.be.true
    })

    cy.get('[title="Media Id"]').click()
    // get unsorted data
    cy.wait('@getData').then((interception) => {
      const responseData = interception?.response?.body
      const sortedData = sortData(responseData.data, 'DESC')
      expect(JSON.stringify(responseData.data) === JSON.stringify(sortedData)).to.be.false
    })
  })
})
