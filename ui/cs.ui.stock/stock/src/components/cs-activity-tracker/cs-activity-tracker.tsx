import React from 'react'
import { EventsType, useIdleTimer } from 'react-idle-timer'

interface CsActivityTrackerProps {
  eventsType?: EventsType[]
  debounce?: number
}

export const CsActivityTracker = ({ eventsType, debounce }: CsActivityTrackerProps) => {
  useIdleTimer({
    events: eventsType || ['mousemove', 'keydown', 'mousedown'],
    debounce: debounce || 10000,
    onAction: () => localStorage.setItem('session_activity', new Date().getTime().toString()),
  })
  return <> </>
}
