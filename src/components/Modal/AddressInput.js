import React from 'react'
import Grid from '@material-ui/core/Grid'

import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'

const addressFields = [
  {
    label: 'City',
    google_name: 'locality',
  },

  {
    label: 'Street',
    google_name: 'route',
  },
  {
    label: 'House number',
    google_name: 'street_number',
  },

  {
    label: 'Zip code',
    google_name: 'postal_code',
  },
]

export default function AddressInput({
  classes: { container },
  address,
  inputController,
}) {
  return (
    <Grid container justify="space-around" spacing={2}>
      {addressFields.map((field, key) => (
        <Grid item className={container} key={key} lg={6}>
          <TextField
            value={address[field.google_name] || ''}
            onChange={inputController(field.google_name)}
            variant="outlined"
            id={field.google_name}
            required
            label={field.label}
            fullWidth
            inputProps={{ 'data-testid': field.google_name }}
          />
        </Grid>
      ))}
    </Grid>
  )
}

AddressInput.propTypes = {
  address: PropTypes.object,
  inputController: PropTypes.func.isRequired,
}
