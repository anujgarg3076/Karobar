interface Statistics {
  name: string
  value: number
}
export interface GroupStatistics {
  name: string
  statistics: Statistics[]
}

export interface LabelProps {
  group: GroupStatistics
}
