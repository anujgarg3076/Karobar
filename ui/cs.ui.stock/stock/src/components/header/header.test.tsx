import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from './header'

describe('MainHeader', () => {
  it('renders Header component', () => {
    render(<Header />)

    expect(screen.getByText(/STOCK/i)).toBeInTheDocument()
  })
})
