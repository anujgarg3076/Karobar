import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { FIELDS_QUERY_KEY, FIELDS_URL } from 'constants/api'
import { GetConfigurationFieldResponse } from 'types/api'

function fetchFields() {
  return axios.get<GetConfigurationFieldResponse>(`${FIELDS_URL}`).then(({ data: { data } }) => data)
}

export function useConfigurationFields() {
  return useQuery([FIELDS_QUERY_KEY], fetchFields)
}
