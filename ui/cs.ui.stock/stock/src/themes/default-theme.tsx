import { createTheme } from '@mui/material/styles'

export const DefaultTheme = createTheme({
  palette: {
    primary: {
      main: '#071D49',
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#F0F7FF',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#E0EFFF',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          visibility: "hidden",
          "&::before": {
            content: '" *"',
            visibility: "visible",
          },
          color: '#db3131',
          '&$error': {
            color: '#db3131',
          },
        },
      },
    },
  },
})
