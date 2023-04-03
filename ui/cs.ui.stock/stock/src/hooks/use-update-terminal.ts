import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TERMINALS_URL } from 'constants/api'
import { PatchTerminalsApiRequestData, PatchTerminalsApiResponse } from 'types/api'

export const useUpdateTerminal = () => {
  const client = useQueryClient()

  const patchData = (postData: PatchTerminalsApiRequestData) => {
    return axios.patch<
      PatchTerminalsApiResponse,
      AxiosResponse<PatchTerminalsApiResponse>,
      PatchTerminalsApiRequestData
    >(TERMINALS_URL, postData)
  }

  return useMutation<{ data: PatchTerminalsApiResponse }, unknown, PatchTerminalsApiRequestData>(
    patchData,
    {
      retry: 0,
      onSuccess: ({ data }) => {
        //TODO: remove
        console.log('useMutation on success', data)

        client.invalidateQueries()
      },
    }
  )
}
