import type { ColumnFilter } from '@tanstack/react-table'
import { Terminal } from 'types/terminal'

export interface TerminalTableResponse {
  data: Terminal[]
  meta: {
    totalRowCount: number
  }
}

export interface TerminalTableProps {
  filter: ColumnFilter[]
}
