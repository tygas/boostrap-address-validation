import React from 'react'
// setup file

import CustomerDialog from '../../components/Modal/CustomerDialog'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

const whenStable = async () =>
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

describe('Customer add modal', () => {
  it('should render Form with empty street address', () => {
    const props = {
      saveCustomer: jest.fn(),
      customer: {},
      cancel: jest.fn(),
      open: true,
    }
    const wrapper = shallow(<CustomerDialog {...props}></CustomerDialog>)
    expect(wrapper.find('#validate').prop('disabled')).toBeFalsy()
  })
})
