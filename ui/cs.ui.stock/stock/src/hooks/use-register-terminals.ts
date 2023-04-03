import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TERMINALS_URL } from 'constants/api'
import { BaseTerminalData } from 'types/terminal'
import { PostTerminalsApiRequestData, PostTerminalsApiResponse } from 'types/api'

export const useRegisterTerminals = () => {
  const client = useQueryClient()

  const postData = (postData: BaseTerminalData[]) => {
    return axios.post<
      PostTerminalsApiResponse,
      AxiosResponse<PostTerminalsApiResponse>,
      PostTerminalsApiRequestData
    >(TERMINALS_URL, postData)
  }

  return useMutation<{ data: PostTerminalsApiResponse }, unknown, PostTerminalsApiRequestData>(
    postData,
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
