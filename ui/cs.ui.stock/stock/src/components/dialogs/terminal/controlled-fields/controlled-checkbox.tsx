import React from 'react'
import { Controller, FieldValues } from 'react-hook-form'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { ControlledFieldProps } from './controlled-fields.types'

export const ControlledCheckbox = <T extends FieldValues>({
  control,
  label,
  name,
}: ControlledFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormGroup sx={{ paddingTop: '0.7rem' }}>
          <FormControlLabel {...field} control={<Checkbox />} label={label} />
        </FormGroup>
      )}
    />
  )
}
