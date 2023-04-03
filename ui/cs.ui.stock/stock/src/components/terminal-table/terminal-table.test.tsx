import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useTerminalTableQuery } from './terminal-table.hook'
import { TerminalTable } from './terminal-table'
import { ClientWrapper } from 'test-utils/client-wrapper'
import { MOCK_TERMINALS } from 'test-utils/mock-data/terminals'
import { ALL_TERMINALS_FILTER } from 'constants/string'
import { useConfigurationFields } from 'hooks/use-configuration-fields'
import { MOCK_CONFIGURATION_FIELDS } from 'test-utils/mock-data/configuration-types'

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

const mockedUseTerminalTableQuery = useTerminalTableQuery as jest.Mock<any>
const mockeduseConfigurationFields = useConfigurationFields as jest.Mock<any>

// Mock the hook module
jest.mock('./terminal-table.hook')
jest.mock('../../hooks/use-configuration-fields')

describe('<TerminalTable />', () => {
  beforeEach(() => {
    mockedUseTerminalTableQuery.mockImplementation(() => ({ isLoading: true }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Check all terminal table', async () => {
    mockedUseTerminalTableQuery.mockImplementation(() => ({
      status: 'success',
      data: {
        pages: [
          {
            data: MOCK_TERMINALS,
            meta: {
              totalRowCount: MOCK_TERMINALS.length,
            },
          },
        ],
      },
    }))

    mockeduseConfigurationFields.mockImplementation(() => ({
      status: 'success',
      data: MOCK_CONFIGURATION_FIELDS,
    }))

    render(ClientWrapper(<TerminalTable filter={[{ id: 'group', value: ALL_TERMINALS_FILTER }]} />))

    await waitFor(() => {
      expect(screen.getByText(/Fetched 10/i)).toBeInTheDocument()
      expect(screen.getByText(/IN-STOCK only/i)).toBeInTheDocument()
      expect(screen.getByText(/SUSPENDED/i)).toBeInTheDocument()
    })
  })

  it('Check one terminal table', async () => {
    mockedUseTerminalTableQuery.mockImplementation(() => ({
      status: 'success',
      data: {
        pages: [
          {
            data: [MOCK_TERMINALS[1]],
            meta: {
              totalRowCount: 1,
            },
          },
        ],
      },
    }))

    render(ClientWrapper(<TerminalTable filter={[{ id: 'group', value: '*' }]} />))

    await waitFor(() => {
      expect(screen.getByText(/Fetched 1/i)).toBeInTheDocument()
      expect(screen.queryByText(/INSTALLED/i)).not.toBeInTheDocument()
    })
  })
})
