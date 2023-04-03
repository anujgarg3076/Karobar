export interface BaseTerminalData {
  type: string
  [key: string]: string
}

export interface UpdateTerminalData extends BaseTerminalData {
  id: string
}

export interface Terminal extends BaseTerminalData {
  id: string
  state: string
}

interface StateFlow {
  state: string
  event: string
  nextState: string
  action: string | null
  manual: number
}
interface Attr {
  attrName: string
  attrValue: string | null
  attrValueLarge: string | null
  history: number
  key: number
  nocopy: number
}

export interface TerminalType {
  available: number
  defOwner: string | null
  factory: string | null
  institution: string | null
  group: string | null
  minAvailable: number
  mediaType: string
  note: string | null
  refAttrName: string
  typeclass: string | null
  vendor: string | null
  attrs: Attr[]
  stateFlows: StateFlow[]
}

export interface ConfigurationField {
  id: string
  name: string
}

export interface StateChangeData {
  id: string
  type: string
  currentState: string
  event: string
  note: string
}
