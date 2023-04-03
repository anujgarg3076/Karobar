import axios, { AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EVENTS_URL } from 'constants/api'
import { StateChangeData } from 'types/terminal'
import { StateChangePostApiRequest, StateChangePostApiResponse } from 'types/api'

export const useChangeState = () => {
  const client = useQueryClient()

  const postData = (postData: StateChangeData[]) => {
    return axios.post<
      StateChangePostApiResponse,
      AxiosResponse<StateChangePostApiResponse>,
      StateChangePostApiRequest
    >(EVENTS_URL, postData)
  }

  return useMutation<{ data: StateChangePostApiResponse }, unknown, StateChangePostApiRequest>(
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
