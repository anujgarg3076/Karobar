import { SetStateAction } from 'react'

export interface SidebarProps {
  activeTab: string
  setActiveTab: (activeTab: SetStateAction<string>) => void
}
