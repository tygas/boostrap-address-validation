import React, { useState } from 'react'
import Grid from './components/Customers/Grid'
import { makeStyles } from '@material-ui/core/styles'
import CustomerDialog from './components/Modal/CustomerDialog'
import * as persistence from './persistence/persistence'
import { Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}))

function App() {
  const classes = useStyles()
  const [customers, setCustomers] = useState(persistence.getCustomers())
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false)
  const [customerData, setCustomerData] = useState({})

  const addOrEditCustomer = (customer) => {
    setCustomerData(customer)
    setOpenCustomerDialog(true)
  }

  const saveCustomer = (customer) => {
    setCustomers(persistence.saveCustomer(customer))
    setOpenCustomerDialog(false)
  }

  const deleteCustomer = (id) => {
    setCustomers(persistence.deleteCustomer(id))
  }

  return (
    <div className={classes.root + ' day'}>
      <Box width="75%" m="0 auto" className="body-box">
        <Grid
          customers={customers}
          addOrEditCustomer={addOrEditCustomer}
          deleteCustomer={deleteCustomer}
        />
        <CustomerDialog
          open={openCustomerDialog}
          cancel={() => setOpenCustomerDialog(false)}
          saveCustomer={saveCustomer}
          customer={customerData}
        />
      </Box>
    </div>
  )
}

export default App
