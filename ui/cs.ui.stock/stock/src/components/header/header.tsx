import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

export const Header = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary' }}>
      <Toolbar>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ flexGrow: 1, textTransform: 'uppercase' }}>
          tlms stock
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
