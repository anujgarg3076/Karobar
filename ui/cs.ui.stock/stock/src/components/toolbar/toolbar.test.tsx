import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Toolbar } from './toolbar'
import { ClientWrapper } from 'test-utils/client-wrapper'

describe('Toolbar', () => {
  it('is rendered correctly', () => {
    render(ClientWrapper(<Toolbar selectedRows={[]} />))
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New from file' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Change state' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save to file/i })).toBeInTheDocument()
  })
})
