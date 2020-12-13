const saveCustomers = (customers) =>
  localStorage.setItem('customers', JSON.stringify(customers))

const generateId = () => {
  const id = Number(localStorage.getItem('lastId')) + 1
  localStorage.setItem('lastId', id)
  return id
}

export const getCustomers = () =>
  JSON.parse(localStorage.getItem('customers')) || []

export const deleteCustomer = (id) => {
  const updatedCustomers = getCustomers().filter(
    (customer) => id !== customer.id,
  )
  saveCustomers(updatedCustomers)
  return updatedCustomers
}

export const saveCustomer = (customer) => {
  const customers = customer.id
    ? getCustomers().filter((c) => customer.id !== c.id)
    : getCustomers()

  customer.id = generateId()
  customers.unshift(customer)
  saveCustomers(customers)
  return customers
}
