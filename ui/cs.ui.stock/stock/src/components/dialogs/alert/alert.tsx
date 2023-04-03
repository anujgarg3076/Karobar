import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, Alert as MUIAlert } from '@mui/material'

interface AlertProps {
  open: boolean
  onClose: () => void
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export const Alert = ({ open, onClose, message, type }: AlertProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <MUIAlert severity={type}>{message}</MUIAlert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
