import React, { useMemo } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTerminalTypes } from 'hooks/use-terminal-types'
import { useChangeState } from 'hooks/use-change-state'
import { useClassifiers } from 'hooks/use-classifiers'
import { StockTextField } from 'components/dialogs/stock-text-field'
import {
  StateChangeProps,
  StateChangeSchema,
  StateChangeValues,
  STATE_CHANGE_DEFAULT_VALUES,
} from './state-change.types'
import { Alert } from 'components/dialogs/alert/alert'
import { TLMS_ACTION } from 'constants/string'

export const StateChangeDialog = ({ open, onClose, selectedRows }: StateChangeProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StateChangeValues>({
    defaultValues: STATE_CHANGE_DEFAULT_VALUES,
    resolver: zodResolver(StateChangeSchema),
  })

  const changeState = useChangeState()
  const terminalTypes = useTerminalTypes()
  const terminalTypeData = useMemo(() => terminalTypes.data || [], [terminalTypes])

  const typeActions = useClassifiers({ typeName: TLMS_ACTION }).data || []

  const [selectedEvent] = watch(['event'])

  let events: string[] = []
  if (selectedRows.length > 0) {
    const terminalType = terminalTypeData.find((el) => el.mediaType == selectedRows[0].type)
    if (terminalType) {
      events = terminalType.stateFlows
        .filter((el) => el.state == selectedRows[0].state && el.manual == 1)
        .map((el) => el.event)
    }
  }

  if (events.length == 0)
    return (
      <Alert
        open={open}
        onClose={onClose}
        type="info"
        message="There are no state change events available for the media type and current state of the terminal."
      />
    )

  const onSubmit = (data: StateChangeValues) => {
    const dataForApi = selectedRows.map((row) => ({
      id: row.id,
      type: row.type,
      currentState: row.state,
      event: data.event,
      note: data.note,
    }))

    changeState.mutate(dataForApi, {
      onSuccess: ({ data }) => {
        reset(STATE_CHANGE_DEFAULT_VALUES)
      },
      onError: (err) => {
        console.log('Failed to change state', err)
      },
    })
    onClose()
  }

  const onError = () => console.log('Internal error')

  const radioButtons = events.map((event) => {
    const action = typeActions.find((typeAction) => typeAction.code === event)

    return (
      <FormControlLabel
        key={event}
        value={action ? action.code : event}
        control={<Radio />}
        label={action ? action.name : event}
      />
    )
  })

  const handleCancel = () => {
    reset(STATE_CHANGE_DEFAULT_VALUES)
    onClose()
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>State change</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          p: '3px',
        }}>
        <Box
          sx={{
            width: '100%',
            margin: '5px',
            padding: '15px',
          }}>
          <Controller
            name="event"
            control={control}
            render={({ field }) => (
              <FormControl required>
                <FormLabel>Choose an event:</FormLabel>
                <RadioGroup {...field}>{radioButtons}</RadioGroup>
              </FormControl>
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <StockTextField
                {...field}
                label="Note"
                error={!!errors['note']}
                helperText={errors['note']?.message?.toString()}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit, onError)} disabled={selectedEvent == ''}>
          Change
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
