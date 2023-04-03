import React from 'react'
import { ControlledFieldProps } from './controlled-fields.types'
import { Controller, useFormState, FieldValues } from 'react-hook-form'
import { StockTextField } from 'components/dialogs/stock-text-field'

export const ControlledText = <T extends FieldValues>({
  control,
  label,
  name,
  isRequired,
  width,
  readOnly,
}: ControlledFieldProps<T>) => {
  const { errors } = useFormState({ control })
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <StockTextField
          {...field}
          required={isRequired}
          label={label}
          disabled={readOnly}
          error={!!errors[name]}
          helperText={errors[name]?.message?.toString()}
          sx={width}
        />
      )}
    />
  )
}
