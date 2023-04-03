import { Tab, Tabs, Typography } from '@mui/material'
import { ALL_TERMINALS_FILTER, ALL_TERMINALS_LABEL } from 'constants/string'
import { useGroups } from 'hooks/use-groups'
import React from 'react'
import { SidebarProps } from './sidebar.types'
import { TabLabel } from './tab-label/tab-label'

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const groups = useGroups().data || []

  const tabs = groups.map((group) => (
    <Tab
      key={group.name}
      label={<TabLabel group={group} />}
      value={group.name}
      sx={{ alignItems: 'self-start' }}
    />
  ))

  const firstTab = (
    <Tab
      label={
        <Typography variant="h6" sx={{ textTransform: 'none', color: 'black' }}>
          {ALL_TERMINALS_LABEL}
        </Typography>
      }
      value={ALL_TERMINALS_FILTER}
      sx={{ alignItems: 'self-start' }}
    />
  )

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={activeTab}
      onChange={(_, value) => setActiveTab(value)}>
      {firstTab}
      {tabs}
    </Tabs>
  )
}
