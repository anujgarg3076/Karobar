import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ClientWrapper } from 'test-utils/client-wrapper'
import { Toolbar } from 'components/toolbar/toolbar'
import { useTerminalTypes } from 'hooks/use-terminal-types'
import { useClassifiers } from 'hooks/use-classifiers'
import { MOCK_TERMINAL_TYPES } from 'test-utils/mock-data/terminal-types'
import { MOCK_STOCK_LOCATIONS } from 'test-utils/mock-data/classifiers'

const mockedUseTerminalTypes = useTerminalTypes as jest.Mock<any>
const mockedUseClassifiers = useClassifiers as jest.Mock<any>

jest.mock('hooks/use-terminal-types')
mockedUseTerminalTypes.mockImplementation(() => ({
  data: MOCK_TERMINAL_TYPES,
}))

jest.mock('hooks/use-classifiers')
mockedUseClassifiers.mockImplementation(() => ({
  data: MOCK_STOCK_LOCATIONS,
}))

describe('New Terminal dialog', () => {
  it('opens and closes correctly', async () => {
    render(ClientWrapper(<Toolbar selectedRows={[]} />))
    const user = userEvent.setup()

    const newButton = screen.getByRole('button', { name: 'New' })

    // Test that the dialog is displayed correctly
    user.click(newButton)

    await waitFor(() => {
      expect(screen.findAllByRole('presentation')).toBeVisible
      expect(screen.getByText('New Terminal')).toBeInTheDocument()
    })

    // Test that the dialog is closed when Cancel is pressed
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    user.click(cancelButton)
    await waitFor(() => {
      expect(screen.queryByRole('presentation')).not.toBeVisible
    })
  })

  it('has two mandatory fields for media type AMS-DEFAULT', async () => {
    render(ClientWrapper(<Toolbar selectedRows={[]} />))
    const user = userEvent.setup()

    const newButton = screen.getByRole('button', { name: 'New' })
    await user.click(newButton)

    // When you click Save you should get one error
    const saveButton = screen.getByRole('button', { name: /save/i })
    user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Please select the media type')).toBeInTheDocument()
      expect(screen.queryByText('Serial number is required')).not.toBeInTheDocument()
    })

    // Select a value for Media type
    const mediaTypeCombo = screen.getByRole('combobox', { name: /media type/i })
    userEvent.type(mediaTypeCombo, 'D')
    await waitFor(() => screen.getByText('AMS-DEFAULT'))

    fireEvent.click(screen.getByText('AMS-DEFAULT'))
    await waitFor(() =>
      expect(screen.queryByText('Please select the media type')).not.toBeInTheDocument()
    )

    // Serial number became required because of the media type we chose
    user.click(saveButton)
    await waitFor(() => {
      expect(screen.getByText('Serial number is required')).toBeInTheDocument()
    })

    // Check that two other fields have been populated with default values
    // based on the selected media type
    const model = screen.getByLabelText(/model/i)
    expect(model).toHaveValue('Option 1')
    const name = screen.getByLabelText(/name/i)
    expect(name).toHaveValue('AMS Demo ATM')

    const locationCombo = screen.getByRole('combobox', { name: /location/i })
    userEvent.type(locationCombo, 'S')
    await waitFor(() => screen.getByText('Stock'))

    // Type in the serial number
    const serialNo = screen.getByLabelText(/serial number/i)
    userEvent.type(serialNo, '12')
    await waitFor(() => {
      expect(serialNo).toHaveValue('1')
    })
    await waitFor(() => {
      expect(serialNo).toHaveValue('12')
      expect(screen.queryByText('Serial number is required')).not.toBeInTheDocument()
    })

    //TODO: Test successful terminal registration
  })

  it('Serial number is not mandatory for media type React', async () => {
    render(ClientWrapper(<Toolbar selectedRows={[]} />))
    const user = userEvent.setup()

    const newButton = screen.getByRole('button', { name: 'New' })
    user.click(newButton)

    await waitFor(() => {
      expect(screen.findAllByRole('presentation')).toBeVisible
      expect(screen.getByText('New Terminal')).toBeInTheDocument()
    })

    const mediaTypeCombo = screen.getByRole('combobox', { name: /media type/i })
    userEvent.type(mediaTypeCombo, 'R')
    await waitFor(() => screen.getByText('React'))

    fireEvent.click(screen.getByText('React'))
    await waitFor(() => {
      const model = screen.getByLabelText(/model/i)
      expect(model).toHaveValue('Option 1')
    })

    const saveButton = screen.getByRole('button', { name: /save/i })
    user.click(saveButton)
    expect(screen.queryByText('Serial number is required')).not.toBeInTheDocument()
  })
})
