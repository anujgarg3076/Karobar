import React from 'react'
import renderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { TabLabel } from './tab-label'

it('is rendered correctly', () => {
  const statistics = [
    { name: 'Installed', value: 8 },
    { name: 'Replaced', value: 3 },
  ]
  const group = { name: 'POS', statistics }
  const component = renderer.create(<TabLabel group={group} />)
  const tree = component.toJSON() as ReactTestRendererJSON
  expect(tree).toMatchSnapshot()
})
