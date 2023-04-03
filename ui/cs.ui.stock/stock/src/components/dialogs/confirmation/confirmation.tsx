import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert as MUIAlert,
} from '@mui/material'

interface ConfirmationProps {
  open: boolean
  onCancel: () => void
  onAccept: () => void
  message: string
  title: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export const Confirmation = ({
  open,
  onCancel,
  onAccept,
  message,
  title,
  type,
}: ConfirmationProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <MUIAlert severity={type}>{message}</MUIAlert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAccept} autoFocus>
          yes
        </Button>
        <Button onClick={onCancel}>No</Button>
      </DialogActions>
    </Dialog>
  )
}
