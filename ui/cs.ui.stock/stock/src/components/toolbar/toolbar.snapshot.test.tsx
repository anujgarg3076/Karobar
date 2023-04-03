import React from 'react'
import renderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Toolbar } from './toolbar'
import { ClientWrapper } from '../../test-utils/client-wrapper'

it('is rendered correctly', () => {
  const component = renderer.create(ClientWrapper(<Toolbar selectedRows={[]} />))
  const tree = component.toJSON() as ReactTestRendererJSON
  expect(tree).toMatchSnapshot()
})
