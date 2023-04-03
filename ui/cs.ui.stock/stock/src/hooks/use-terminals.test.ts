import { renderHook } from '@testing-library/react'
import { MOCK_TERMINALS } from '../test-utils/mock-data/terminals'
import { useTerminals } from './use-terminals'

jest.mock('@tanstack/react-query', () => {
  return {
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: () => ({
      data: MOCK_TERMINALS,
    }),
  }
})

describe('useTerminals hook', () => {
  const { result } = renderHook(() => useTerminals())
  const terminals = result.current.data || []

  it('correct terminal structure', () => {
    expect(terminals).toBeTruthy()
  })

  //TODO: Transformations tests to be added if any
})
