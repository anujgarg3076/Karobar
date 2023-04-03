import { PostTerminalsApiRequestData } from 'types/api'

export interface NewFromFileProps {
  open: boolean
  onClose: () => void
}
export interface FileData {
  filename: string
  postData?: PostTerminalsApiRequestData
}
