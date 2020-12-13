import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import CustomerDialog from '../../components/Modal/CustomerDialog'

const props = {
  saveCustomer: jest.fn(),
  customer: {
    name: 'Tetx',
    email: 'aas@asd.lt',
    locality: 'kaunas',
    street: 'Ašigalio',
    street_number: '555',
    postal_code: '49519',
  },
  cancel: jest.fn(),
  open: true,
}

test('Displays error msg on invalid customer', async () => {
  const { getByText } = render(<CustomerDialog {...props} />)
  fireEvent.click(getByText('Validate'))
  await waitFor(() => screen.getByTestId('alert'))

  expect(screen.getByTestId('alert')).toHaveTextContent(
    'The street does not have a house with the given number',
  )
})

test('Displays success msg on valid customer', async () => {
  const { getByTestId, getByText } = render(<CustomerDialog {...props} />)

  fireEvent.change(getByTestId('locality'), {
    target: { value: 'Kaunas' },
  })
  fireEvent.change(getByTestId('street_number'), {
    target: { value: '15' },
  })
  fireEvent.change(getByTestId('route'), {
    target: { value: 'Asigalio' },
  })
  fireEvent.change(getByTestId('postal_code'), {
    target: { value: '49519' },
  })

  fireEvent.click(getByText('Validate'))

  await waitFor(() => screen.getByTestId('alert'))
  expect(screen.getByTestId('alert')).toHaveTextContent('Address is valid')
})
