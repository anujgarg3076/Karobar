import { useTheme } from '@mui/material'
import React from 'react'

export const ChangeStatusIcon = () => {
  const theme = useTheme()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{ fill: theme.palette.primary.main }}>
      <path d="M0,0H24V24H0Z" style={{ fill: 'none' }} />
      <path d="M22.21,3.21,20.79,1.79,18.51,4.07A2.09,2.09,0,0,0,18,4H6A2,2,0,0,0,4,6V18a2.09,2.09,0,0,0,.07.51L1.79,20.79l1.42,1.42,2.28-2.28A2.09,2.09,0,0,0,6,20H18a2,2,0,0,0,2-2V6a2.09,2.09,0,0,0-.07-.51ZM18,18H6L18,6Z" />
    </svg>
  )
}
