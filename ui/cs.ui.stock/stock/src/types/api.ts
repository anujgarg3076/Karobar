import { Classifier } from 'types/classifier'
import { GroupStatistics } from 'components/sidebar/tab-label/tab-label.types'
import {
  Terminal,
  BaseTerminalData,
  TerminalType,
  ConfigurationField,
  StateChangeData,
  UpdateTerminalData,
} from './terminal'

export interface ApiStatus {
  type?: 'success' | 'error' | 'warning'
  message?: string
}

export interface ApiResponse<T> {
  data: T[]
  status: ApiStatus
}

//POST/PATCH/PUT - PPP
export interface PPPDetails {
  [key: string]: any
}
export interface PPPData {
  count: number
  details: PPPDetails[]
}

export interface PPPApiResponse {
  status: {
    succeeded: PPPData
    failed: PPPData
    skipped: PPPData
  }
}

export type GetTerminalsApiResponse = ApiResponse<Terminal>
export type PostTerminalsApiResponse = PPPApiResponse
export type PostTerminalsApiRequestData = BaseTerminalData[]
export type PatchTerminalsApiResponse = PPPApiResponse
export type PatchTerminalsApiRequestData = UpdateTerminalData

export interface GetTerminalTypesApiResponse {
  terminalTypes: TerminalType[]
}

export type GetGroupsApiResponse = ApiResponse<GroupStatistics>

export type GetConfigurationFieldResponse = ApiResponse<ConfigurationField>

export type StateChangePostApiRequest = StateChangeData[]
export type StateChangePostApiResponse = PPPApiResponse

export interface GetClassifiersApiResponse {
  classifiers: Classifier[]
}
