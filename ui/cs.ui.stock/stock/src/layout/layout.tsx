import React, { useState } from 'react'
import { Box } from '@mui/material'

import { Header } from 'components/header/header'
import { Sidebar } from 'components/sidebar/sidebar'
import { TerminalTable } from 'components/terminal-table/terminal-table'
import { ALL_TERMINALS_FILTER } from 'constants/string'
import { CsActivityTracker } from 'components/cs-activity-tracker/cs-activity-tracker'

export const Layout = () => {
  const [currentGroup, setCurrentGroup] = useState(ALL_TERMINALS_FILTER)

  const filter = currentGroup === ALL_TERMINALS_FILTER ? [] : [{ id: 'group', value: currentGroup }] // Filtering by media_type = '*' as group = '*' mau ot work for types with null type group in DB

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', maxHeight: `${screen.availHeight - 200}px` }}>
        <Box sx={{ flex: '0 0 14rem', overflow: 'auto' }}>
          <Sidebar activeTab={currentGroup} setActiveTab={setCurrentGroup} />
        </Box>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TerminalTable filter={filter} />
        </Box>
      </Box>
      {/* Setting session_activity value on evry click debounce for 1 minute */}
      <CsActivityTracker />
    </>
  )
}
