import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { SxProps, Theme } from '@mui/material'

export interface ControlledFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  isRequired?: boolean
  width?: SxProps<Theme>
  freeSolo?: boolean
  readOnly?: boolean
}

export interface ControlledAutoCompleteFieldProps<T extends FieldValues>
  extends ControlledFieldProps<T> {
  options: string[]
}
