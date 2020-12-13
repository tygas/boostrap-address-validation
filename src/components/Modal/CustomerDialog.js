import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import { Button, Backdrop } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import getGoogleAddress from '../../api/getGoogleAddress'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddressInput from './AddressInput'
import { messages } from '../../properties/errorsMessages'
import PropTypes from 'prop-types'

const addressFields = ['route', 'street_number', 'locality', 'postal_code']

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  input: {
    padding: theme.spacing(2),
  },
  addressTitle: {
    padding: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
    position: 'absolute',
  },
  error: {
    color: 'red',
  },
  message: {
    padding: theme.spacing(1),
  },
}))

const validateEntry = (customerData) => {
  const errors = {}
  if (!customerData.name) errors.name = messages.noName
  if (!/^[a-zA-Z ]+$/.test(customerData.name))
    errors.name = messages.invalidSymbols
  if (!customerData.email) {
    errors.email = 'Email is required'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(customerData.email)
  ) {
    errors.email = 'Invalid email address'
  }
  return errors
}

export default function CustomerDialog(props) {
  console.log(props)
  const classes = useStyles()
  const [customer, setCustomer] = useState({})
  const [validated, setValidated] = useState(false)
  const [errors, setErrors] = useState({})
  const [noErrors, setNoErrors] = useState(true)
  const [loading, setLoading] = useState(false)
  const [addressSuggestion, setAddressSuggestion] = useState(null)

  const inputController = (field) => (event) => {
    setValidated(false)
    setCustomer({
      ...customer,
      [field]: event.target.value || event.target.innerText,
    })
  }

  const handleValidation = () => {
    setLoading(true)
    const { id, name, email, formatted_address, ...address } = customer
    const queryAddress = addressFields.reduce(
      (query, field) => (address[field] ? query + ' ' + address[field] : query),
      '',
    )

    const validatedErrors = validateEntry({ name, email })
    getGoogleAddress(queryAddress)
      .then(({ data }) => {
        if (data.status === 'OK') {
          const result = data.results[0]

          const addressComponents = result.address_components
            .filter((comp) => addressFields.includes(comp.types[0]))
            .reduce(
              (a, comp) => ({ ...a, [comp.types[0]]: comp.short_name }),
              {},
            )
          setAddressSuggestion(
            Object.assign(
              {
                formatted_address: result.formatted_address,
                center:
                  result.geometry.location.lat +
                  ',' +
                  result.geometry.location.lng,
              },
              addressComponents,
            ),
          )
          if (!addressComponents.street_number)
            validatedErrors.suggestedAddress = messages.noHouseNumber
        } else {
          validatedErrors.suggestedAddress = messages.notFound
          if (data.error_message)
            validatedErrors.error_message = data.error_message
        }
      })
      .catch((error) => {
        debugger
        validatedErrors.suggestedAddress = error.response.data.error_message
      })
      .finally(() => {
        setValidated(true)
        setErrors(validatedErrors)
        setNoErrors(!Object.entries(validatedErrors).length)
        setLoading(false)
      })
  }

  const saveCustomer = () => {
    props.saveCustomer({ ...customer, ...addressSuggestion })
    props.cancel()
  }

  useEffect(() => {
    setCustomer(props.customer)
    setValidated(false)
  }, [props])

  return (
    <>
      <Dialog open={props.open} onClose={props.cancel}>
        <DialogTitle id="form-dialog-title">
          {props.customer.id ? 'Edit customer data' : 'Register new customer'}
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            justify="space-around"
            className={classes.container}
            spacing={2}
          >
            <Grid item lg={6}>
              <TextField
                value={customer.name || ''}
                onChange={inputController('name')}
                variant="outlined"
                autoFocus
                required
                id="name"
                fullWidth
                label="Full name"
                error={!!(validated && errors.name)}
                helperText={validated && errors.name}
              />
            </Grid>
            <Grid item lg={6}>
              <TextField
                fullWidth
                value={customer.email || ''}
                onChange={inputController('email')}
                variant="outlined"
                id="email"
                label="Email"
                type="email"
                required
                error={!!(validated && errors.email)}
                helperText={validated && errors.email}
              />
            </Grid>
          </Grid>

          <>
            <AddressInput
              classes={classes}
              address={customer}
              inputController={inputController}
            />
            {validated ? (
              <>
                {addressSuggestion && (
                  <>
                    <Typography className={classes.message}>
                      {errors.suggestedAddress ? (
                        <Alert
                          severity="error"
                          id="addressAlert"
                          data-testid="alert"
                        >
                          {errors.suggestedAddress}
                        </Alert>
                      ) : (
                        <Alert severity="success" data-testid="alert">
                          Address is valid
                        </Alert>
                      )}
                    </Typography>
                    <Typography paragraph className={classes.message}>
                      {addressSuggestion.formatted_address}
                    </Typography>
                    {addressSuggestion.center && (
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAILGVlt-SOiL381JT3TQ9dxxoNIUuxrV8&center=${addressSuggestion.center}&zoom=12&size=480x125&maptype=roadmap&sensor=false`}
                        width="480"
                        height="125"
                        alt="Google"
                        style={{ padding: '8px', borderRadius: '8px' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              errors &&
              errors.error_message && (
                <Alert severity="error" id="addressAlert" data-testid="alert">
                  <AlertTitle>Network Error</AlertTitle>
                  {errors.error_message}
                </Alert>
              )
            )}
          </>
        </DialogContent>
        <DialogActions style={{ paddingBottom: '20px' }}>
          <Button onClick={props.cancel} variant="contained">
            Cancel
          </Button>

          {validated ? (
            <>
              {noErrors && (
                <Button
                  onClick={saveCustomer}
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleValidation}
              color="primary"
              variant="contained"
              id="validate"
            >
              Validate
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={loading} timeout={1}>
        <CircularProgress />
      </Backdrop>
    </>
  )
}

CustomerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  saveCustomer: PropTypes.func.isRequired,
  customer: PropTypes.object,
}
