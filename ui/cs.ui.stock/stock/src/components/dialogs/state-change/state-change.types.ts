import { Terminal } from 'types/terminal'
import { z } from 'zod'

export interface StateChangeProps {
  open: boolean
  onClose: () => void
  selectedRows: Terminal[]
}

export const StateChangeSchema = z.object({
  event: z.string(),
  note: z.string().max(100),
})

export type StateChangeValues = z.infer<typeof StateChangeSchema>

export const STATE_CHANGE_DEFAULT_VALUES = {
  event: '',
  note: ''
}