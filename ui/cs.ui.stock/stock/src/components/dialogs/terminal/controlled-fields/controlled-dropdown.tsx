import React from 'react'
import { Autocomplete } from '@mui/material'
import { Controller, useFormState, FieldValues } from 'react-hook-form'
import { ControlledAutoCompleteFieldProps } from './controlled-fields.types'
import { StockTextField } from 'components/dialogs/stock-text-field'

export const ControlledDropdown = <T extends FieldValues>({
  control,
  label,
  name,
  isRequired,
  width,
  options,
  freeSolo,
}: ControlledAutoCompleteFieldProps<T>) => {
  const { errors } = useFormState({ control })
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          freeSolo={freeSolo}
          options={options}
          onChange={(_, data) => field.onChange(data)}
          isOptionEqualToValue={(option, value) =>
            value === undefined || value === '' || option === value
          }
          onInputChange={(_, data) => {
            if (freeSolo) field.onChange(data)
          }}
          value={field.value as string}
          sx={width}
          renderInput={(params) => (
            <StockTextField
              {...params}
              required={isRequired}
              label={label}
              error={!!errors[name]}
              helperText={errors[name]?.message?.toString()}
              sx={width}
            />
          )}
        />
      )}
    />
  )
}
