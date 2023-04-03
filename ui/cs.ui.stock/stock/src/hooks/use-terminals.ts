import { GetTerminalsApiResponse } from '../types/api';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { TERMINALS_URL, TERMINALS_QUERY_KEY } from '../constants/api'

function fetchTerminals() {
  return axios.get<GetTerminalsApiResponse>(`${TERMINALS_URL}`).then(({ data: { data } }) => data)
}

export function useTerminals() {
  return useQuery([TERMINALS_QUERY_KEY], fetchTerminals)
}
