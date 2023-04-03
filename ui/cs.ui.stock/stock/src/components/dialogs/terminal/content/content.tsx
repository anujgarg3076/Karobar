import React from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'

import { TerminalDialogContentProps } from './content.types'
import { ControlledText } from '../controlled-fields/controlled-text'
import { ControlledDropdown } from '../controlled-fields/controlled-dropdown'

const TwoColumnLayout = styled(Box)({
  display: 'grid',
  width: '100%',
  margin: '5px',
  padding: '15px',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '2rem',
})

export const TerminalDialogContent = ({
  control,
  terminalTypes,
  isSerialNoMandatory,
  stockLocations,
}: TerminalDialogContentProps) => {
  const typeOptions = terminalTypes.map((tt) => tt.mediaType)

  return (
    <TwoColumnLayout>
      <ControlledDropdown
        key="mediaType"
        control={control}
        label="Media type"
        name="type"
        options={typeOptions}
        isRequired
      />
      <ControlledText
        key="serialNo"
        control={control}
        label="Serial number"
        name="tlms_serial_no"
        isRequired={isSerialNoMandatory}
      />
      <ControlledText key="tlms_name" control={control} label="Name" name="tlms_name" />
      <ControlledText key="model" control={control} label="Model" name="tlms_terminal_model" />
      <ControlledText
        key="inventoryNo"
        control={control}
        label="Inventory number"
        name="tlms_inventory_no"
      />
      <ControlledText key="vendor" control={control} label="Vendor" name="vendor" readOnly />
      <ControlledText key="info" control={control} label="Additional info" name="tlms_add_info" />
      <ControlledDropdown
        key="location"
        control={control}
        label="Location"
        name="tlms_location"
        options={stockLocations}
        freeSolo
      />
    </TwoColumnLayout>
  )
}
