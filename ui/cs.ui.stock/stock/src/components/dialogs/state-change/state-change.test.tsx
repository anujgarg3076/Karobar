import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { ClientWrapper } from 'test-utils/client-wrapper'
import { Toolbar } from 'components/toolbar/toolbar'
import { Terminal } from 'types/terminal'
import { useTerminalTypes } from 'hooks/use-terminal-types'
import { MOCK_TERMINALS } from 'test-utils/mock-data/terminals'
import { MOCK_TERMINAL_TYPES } from 'test-utils/mock-data/terminal-types'

const mockedUseTerminalTypes = useTerminalTypes as jest.Mock<any>

jest.mock('hooks/use-terminal-types')
mockedUseTerminalTypes.mockImplementation(() => ({
  data: MOCK_TERMINAL_TYPES,
}))

describe('State change', () => {
  it('works correctly when proper data is received', async () => {
    const terminalData: Terminal[] = MOCK_TERMINALS.filter((terminal) =>
      ['51', '57', '69'].includes(terminal.id)
    )

    render(ClientWrapper(<Toolbar selectedRows={terminalData} />))

    const stateButton = screen.getByRole('button', { name: 'Change state' }) as HTMLButtonElement
    expect(stateButton).toBeEnabled

    // Test that the dialog is displayed correctly
    const user = userEvent.setup()
    user.click(stateButton)

    await waitFor(() => {
      expect(screen.findAllByRole('presentation')).toBeVisible
      expect(screen.getByText(/choose an event/i)).toBeInTheDocument()
      expect(screen.getByText(/instock/i)).toBeInTheDocument()
      expect(screen.getByText(/uninstall/i)).toBeInTheDocument()
      expect(screen.getByText(/note/i)).toBeInTheDocument()
    })

    // Test that the dialog is closed when Cancel is pressed
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    user.click(cancelButton)
    await waitFor(() => expect(screen.queryByRole('presentation')).not.toBeInTheDocument)
  })

  it('is disabled when no rows are selected', async () => {
    render(ClientWrapper(<Toolbar selectedRows={[]} />))

    const stateButton = screen.getByRole('button', { name: 'Change state' }) as HTMLButtonElement
    expect(stateButton).toBeDisabled
  })

  it('is disabled when terminals have different media types', async () => {
    const terminalData: Terminal[] = MOCK_TERMINALS.filter((terminal) =>
      ['51', '67'].includes(terminal.id)
    )

    render(ClientWrapper(<Toolbar selectedRows={terminalData} />))

    const stateButton = screen.getByRole('button', { name: 'Change state' }) as HTMLButtonElement
    expect(stateButton).toBeDisabled
  })

  it('is disabled when terminals have different states', async () => {
    const terminalData: Terminal[] = MOCK_TERMINALS.filter((terminal) =>
      ['51', '53'].includes(terminal.id)
    )

    render(ClientWrapper(<Toolbar selectedRows={terminalData} />))

    const stateButton = screen.getByRole('button', { name: 'Change state' }) as HTMLButtonElement
    expect(stateButton).toBeDisabled
  })

  it('shows a message if no events are available', async () => {
    const terminalData: Terminal[] = MOCK_TERMINALS.filter((terminal) =>
      ['53'].includes(terminal.id)
    )

    render(ClientWrapper(<Toolbar selectedRows={terminalData} />))

    const stateButton = screen.getByRole('button', { name: 'Change state' }) as HTMLButtonElement
    expect(stateButton).toBeEnabled

    const user = userEvent.setup()
    user.click(stateButton)

    await waitFor(() => {
      expect(screen.getByText(/no state change events available/i)).toBeInTheDocument()
    })
  })
})
