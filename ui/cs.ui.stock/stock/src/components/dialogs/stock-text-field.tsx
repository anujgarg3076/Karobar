import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

export const StockTextField = React.forwardRef((props: TextFieldProps, ref) => {
  return (
    <TextField
      {...props}
      variant="standard"
      inputRef={ref}
      sx={{ minHeight: '5rem', width: '100%', ...props.sx }}
    />
  )
})
