import { Typography, TypographyProps } from '@mui/material'
import React from 'react'
import { LabelProps } from './tab-label.types'

const TabText = (props: TypographyProps) => {
  return <Typography {...props} sx={{ textTransform: 'none', ...props.sx }} />
}

export const TabLabel = ({ group }: LabelProps) => {
  const tabHtml = group.statistics.map((oneStat) => (
    <div key={oneStat.name}>
      {/* This is separated out into 3 elements for easier automated testing */}
      <TabText variant="caption">{oneStat.name}</TabText>
      <TabText variant="caption">: </TabText>
      <TabText variant="caption">{oneStat.value}</TabText>
    </div>
  ))
  return (
    <>
      <TabText variant="h6" sx={{ color: 'black' }}>
        {group.name}
      </TabText>
      {tabHtml}
    </>
  )
}
