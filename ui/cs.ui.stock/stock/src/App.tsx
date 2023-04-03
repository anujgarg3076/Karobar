import React from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { DefaultTheme } from './themes/default-theme'

import { loadMirageServerInDevelepomentMode } from '../dev-tools/fake-rest-api/mirage-server'
import { Layout } from 'layout/layout'

// This function isn't included in the production build
loadMirageServerInDevelepomentMode()

const queryClient = new QueryClient()

export const App = () => {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
