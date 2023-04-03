import { Control } from 'react-hook-form'
import { z } from 'zod'
import { TerminalType } from 'types/terminal'

export const terminalDialogContentSchema = z
  .object({
    type: z.string().min(1, 'Please select the media type'),
    tlms_serial_no: z.string().max(16),
    tlms_name: z.string().max(200),
    tlms_terminal_model: z.string().max(16),
    tlms_inventory_no: z.string().max(16),
    vendor: z.string(),
    tlms_add_info: z.string().max(256),
    tlms_location: z.string().max(512),
    refAttr: z.string().optional(), // this field is not visible to users, it's just necessary for validations
  })
  .refine(
    (data) => data.refAttr?.toUpperCase() != 'TLMS_SERIAL_NO' || data.tlms_serial_no.length > 0,
    {
      message: 'Serial number is required',
      path: ['tlms_serial_no'],
    }
  )

export type TerminalDialogContentValues = z.infer<typeof terminalDialogContentSchema>

export interface TerminalDialogContentProps {
  control: Control<TerminalDialogContentValues>
  terminalTypes: TerminalType[]
  isSerialNoMandatory: boolean
  stockLocations: string[]
}
