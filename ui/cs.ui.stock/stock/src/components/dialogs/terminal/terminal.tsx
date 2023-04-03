import React, { useMemo, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRegisterTerminals } from 'hooks/use-register-terminals'
import { useTerminalTypes } from 'hooks/use-terminal-types'
import { PostTerminalsApiRequestData } from 'types/api'
import { TerminalDialogProps } from './terminal.types'
import { terminalDialogContentSchema, TerminalDialogContentValues } from './content/content.types'
import { TERMINAL_DEFAULT_VALUES } from './content/content.constants'
import { TerminalDialogContent } from './content/content'
import { Confirmation } from 'components/dialogs/confirmation/confirmation'
import { useClassifiers } from 'hooks/use-classifiers'
import { TLMS_STOCK_LOCATION } from 'constants/string'

const sanitizePostData = (data: TerminalDialogContentValues): PostTerminalsApiRequestData => {
  const { vendor: _vendor, refAttr: _refAttr, ...postData } = data // no need for vendor, refAttr. it is readonly
  return [{ ...postData }]
}

export const TerminalDialog = ({ title, open, onClose }: TerminalDialogProps) => {
  const { control, handleSubmit, setValue, watch, reset, formState, clearErrors } =
    useForm<TerminalDialogContentValues>({
      defaultValues: TERMINAL_DEFAULT_VALUES,
      resolver: zodResolver(terminalDialogContentSchema),
    })

  const registerTerminals = useRegisterTerminals()

  const onSubmit = (data: TerminalDialogContentValues) => {
    const postData = sanitizePostData(data)
    console.log('Form data that was submitted: ', postData)
    registerTerminals.mutate(postData, {
      onSuccess: () => {
        reset(TERMINAL_DEFAULT_VALUES)
      },
      onError: (err) => {
        console.log('Failed to register the terminal', err)
      },
    })
    onClose()
  }

  const onError = () => console.log('Internal error')

  const [mediaType] = watch(['type'])
  const terminalTypes = useTerminalTypes()
  const terminalTypeData = useMemo(() => terminalTypes.data || [], [terminalTypes])
  const stockLocations =
    useClassifiers({ typeName: TLMS_STOCK_LOCATION }).data?.map((c) => c.name) || []

  const [isSerialNoMandatory, setIsSerialNoMandatory] = useState(false)

  React.useEffect(() => {
    const fullMediaType = terminalTypeData.find((obj) => obj.mediaType == mediaType)
    if (fullMediaType) {
      Object.entries(TERMINAL_DEFAULT_VALUES).map(([name, value]) => {
        if (name === 'type') return

        if (name === 'vendor') {
          setValue(name as keyof TerminalDialogContentValues, fullMediaType.vendor || '')
          return
        }

        const attr = fullMediaType.attrs.find(
          (a) => a.attrName.toLowerCase() === name && a.attrValue
        )

        if (typeof value === 'string') {
          const val = attr && attr.attrValue ? attr.attrValue : ''
          setValue(name as keyof TerminalDialogContentValues, val)
        }
      })

      setValue('refAttr', fullMediaType.refAttrName)
      clearErrors()
      if (fullMediaType.refAttrName == 'TLMS_SERIAL_NO') setIsSerialNoMandatory(true)
      else setIsSerialNoMandatory(false)
    }
  }, [mediaType, setValue, terminalTypeData])

  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const handleCancel = () => {
    if (formState.isDirty) {
      setConfirmationOpen(true)
    } else {
      handleConfirmationAccept()
    }
  }

  const handleConfirmationAccept = () => {
    reset(TERMINAL_DEFAULT_VALUES)
    setIsSerialNoMandatory(false)
    setConfirmationOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          borderBottom: '1px dashed black',
          borderTop: '1px dashed black',
          p: '3px',
        }}>
        <TerminalDialogContent
          control={control}
          terminalTypes={terminalTypeData}
          isSerialNoMandatory={isSerialNoMandatory}
          stockLocations={stockLocations}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
      <Confirmation
        open={confirmationOpen}
        onCancel={() => setConfirmationOpen(false)}
        type="warning"
        message="The data you have entered will be lost. Are you sure you want to close this form?"
        title="Are you sure?"
        onAccept={handleConfirmationAccept}
      />
    </Dialog>
  )
}
