import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { TERMINAL_TYPES_QUERY_KEY, TERMINAL_TYPES_URL } from 'constants/api'
import { GetTerminalTypesApiResponse } from 'types/api'

function fetchTerminalTypes() {
  return axios
    .get<GetTerminalTypesApiResponse>(`${TERMINAL_TYPES_URL}`)
    .then(({ data: { terminalTypes } }) => terminalTypes)
}

export function useTerminalTypes() {
  return useQuery([TERMINAL_TYPES_QUERY_KEY], fetchTerminalTypes)
}
