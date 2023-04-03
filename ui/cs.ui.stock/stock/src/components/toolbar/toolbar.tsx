import React, { useState } from 'react'
import InsertDriveFile from '@mui/icons-material/InsertDriveFile'
import NoteAdd from '@mui/icons-material/NoteAdd'
import Edit from '@mui/icons-material/Edit'
import Download from '@mui/icons-material/Download'
import Upload from '@mui/icons-material/Upload'
import {
  Button,
  FormControlLabel,
  FormGroup,
  styled,
  Switch,
  Toolbar as MUIToolbar,
  Typography,
  useTheme,
} from '@mui/material'

import { ChangeStatusIcon } from './toolbar.change-status-icon'
import { Terminal } from 'types/terminal'
import { TerminalDialog } from 'components/dialogs/terminal/terminal'
import { StateChangeDialog } from 'components/dialogs/state-change/state-change'
import { NewFromFile } from 'components/dialogs/new-from-file/new-from-file'

const ToolbarButton = styled(Button)({
  textTransform: 'none',
})

interface ToolbarProps {
  selectedRows: Terminal[]
}

enum ActiveDialogValues {
  None,
  NewTerminal,
  StateChange,
  NewFromFile,
}

export const Toolbar = ({ selectedRows }: ToolbarProps) => {
  const theme = useTheme()
  const [stateChangeButtonEnabled, setStateChangeButtonEnabled] = useState(false)
  const [activeDialog, setActiveDialog] = useState<ActiveDialogValues>(ActiveDialogValues.None)

  const handleDialogOpen = (value: ActiveDialogValues) => {
    setActiveDialog(value)
  }
  const handleDialogClose = () => {
    setActiveDialog(ActiveDialogValues.None)
  }

  React.useEffect(() => {
    const states = selectedRows.map((row) => row.state)
    const types = selectedRows.map((row) => row.type)
    if (
      !states.every((val, _i, arr) => val === arr[0]) ||
      !types.every((val, _i, arr) => val === arr[0]) ||
      selectedRows.length == 0
    )
      setStateChangeButtonEnabled(false)
    else setStateChangeButtonEnabled(true)
  }, [selectedRows])

  return (
    <MUIToolbar>
      <ToolbarButton
        startIcon={<InsertDriveFile />}
        onClick={() => {
          handleDialogOpen(ActiveDialogValues.NewTerminal)
        }}>
        New
      </ToolbarButton>
      <ToolbarButton
        startIcon={<NoteAdd />}
        onClick={() => {
          handleDialogOpen(ActiveDialogValues.NewFromFile)
        }}>
        New from file
      </ToolbarButton>
      <ToolbarButton startIcon={<Edit />}>Edit</ToolbarButton>
      <ToolbarButton
        startIcon={<ChangeStatusIcon />}
        onClick={() => {
          handleDialogOpen(ActiveDialogValues.StateChange)
        }}
        disabled={!stateChangeButtonEnabled}>
        Change state
      </ToolbarButton>
      <FormGroup>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="IN-STOCK only"
          sx={{ marginLeft: '1.5rem', color: theme.palette.primary.main }}
        />
      </FormGroup>
      <Typography variant="body2" sx={{ marginLeft: 'auto', marginRight: '2rem' }}>
        Selected: {selectedRows.length}
      </Typography>
      <ToolbarButton startIcon={<Download />}>Save to file</ToolbarButton>
      <ToolbarButton startIcon={<Upload />}>Load from file</ToolbarButton>
      <TerminalDialog
        open={activeDialog == ActiveDialogValues.NewTerminal}
        title="New Terminal"
        onClose={handleDialogClose}
      />
      <StateChangeDialog
        open={activeDialog == ActiveDialogValues.StateChange}
        onClose={handleDialogClose}
        selectedRows={selectedRows}
      />
      <NewFromFile
        open={activeDialog == ActiveDialogValues.NewFromFile}
        onClose={handleDialogClose}
      />
    </MUIToolbar>
  )
}
