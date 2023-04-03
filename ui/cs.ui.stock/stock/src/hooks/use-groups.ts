import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { GROUPS_QUERY_KEY, GROUPS_URL } from 'constants/api'
import { GetGroupsApiResponse } from 'types/api'

function fetchGroups() {
  return axios.get<GetGroupsApiResponse>(`${GROUPS_URL}`).then(({ data: { data } }) => data)
}

export function useGroups() {
  return useQuery([GROUPS_QUERY_KEY], fetchGroups)
}
