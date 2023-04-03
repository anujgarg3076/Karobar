import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material'
import Upload from '@mui/icons-material/Upload'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { PostTerminalsApiRequestData } from 'types/api'
import { BaseTerminalData } from 'types/terminal'
import { useRegisterTerminals } from 'hooks/use-register-terminals'
import { FileData, NewFromFileProps } from './new-from-file.types'

const isCsvFile = (file: File) => {
  const type = file.type
  const extension = file.name.substring(file.name.length - 4)
  if (
    (type == 'text/csv' || type == 'application/csv' || type == 'application/vnd.ms-excel') &&
    extension == '.csv'
  )
    return true
  return false
}

const csvToPostData = (fileContents: string[][]) => {
  const postData: PostTerminalsApiRequestData = fileContents.map((csvTerminal) => {
    const terminal: BaseTerminalData = { type: '', tlms_serial_no: '' }
    terminal.type = csvTerminal[1]
    terminal.tlms_serial_no = csvTerminal[2]
    terminal.tlms_inventory_no = csvTerminal[3]

    const dynamicAttrs = csvTerminal.slice(5)
    dynamicAttrs.map((attr) => {
      const data = attr.split('::')
      terminal[data[0].trim()] = data[1].trim()
    })

    return terminal
  })
  return postData
}

export const NewFromFile = ({ open, onClose }: NewFromFileProps) => {
  const [fileData, setFileData] = useState<FileData>()
  const fileRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef(0)

  const registerTerminals = useRegisterTerminals()

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    analyzeFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) analyzeFile(file)
  }

  const analyzeFile = async (file: File) => {
    if (!isCsvFile(file)) console.log('Please select a CSV file')

    const text = await file.text()
    const fileContents = Papa.parse(text).data as string[][]

    const postData: PostTerminalsApiRequestData = csvToPostData(fileContents)
    setFileData({ filename: file.name, postData })
  }

  const handleSubmit = () => {
    if (fileData?.postData) {
      registerTerminals.mutate(fileData.postData, {
        onSuccess: ({ data }) => {
          console.log('Terminal registered', data)
          setFileData({ filename: '__done__' })
        },
        onError: (err) => {
          console.log('Failed to register the terminal', err)
          setFileData({ filename: '__done__' })
        },
      })
      console.log('Terminals were submitted')
    } else console.log('Error - nothing to send')
  }

  const handleClose = () => {
    timerRef.current = window.setTimeout(() => setFileData(undefined), 700)
    onClose()
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const waitingForFile = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleFileDrop(e)}
      sx={{
        width: '100%',
        margin: '5px',
        border: '1px dashed #999',
        minHeight: '10rem',
        flexDirection: 'column',
      }}>
      <input ref={fileRef} hidden type="file" accept=".csv" onChange={handleFileSelect} />
      <Upload sx={{ color: '#999' }} />
      <Typography variant="body2" sx={{ color: '#888' }}>
        <Link href="#" onClick={() => fileRef.current?.click()}>
          Add file
        </Link>{' '}
        or drop file here
      </Typography>
    </Box>
  )

  const fileReady = (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        width: '100%',
        margin: '20px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}>
      <InsertDriveFileOutlinedIcon />
      <Box>
        <Typography variant="body1" display="block" sx={{ marginLeft: '0.6rem' }}>
          {fileData?.filename}
        </Typography>
        <Typography variant="body2" sx={{ marginLeft: '0.6rem', color: '#888' }}>
          {fileData?.postData?.length} terminals are ready to be loaded
        </Typography>
      </Box>
    </Box>
  )

  //TODO: Display the results properly
  const results = <Box>Terminals loaded successfully</Box>

  let content

  if (fileData?.filename == '__done__') content = results
  else if (fileData) content = fileReady
  else content = waitingForFile

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>New from file</DialogTitle>
      <DialogContent sx={{ display: 'flex', p: '20px' }}>{content}</DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Load</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
