import { CLASSIFIERS_URL, CLASSIFIERS_QUERY_KEY } from 'constants/api';
import { Classifier } from 'types/classifier';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GetClassifiersApiResponse } from 'types/api';

interface UseClassifiersProps {
  typeName?: string
  code?: string
}

const fetchClassifiers = ({ typeName, code }: UseClassifiersProps) => {
  const url =
    typeName && code
      ? `${CLASSIFIERS_URL}/${typeName}/${code}`
      : typeName
        ? `${CLASSIFIERS_URL}/${typeName}`
        : CLASSIFIERS_URL
  return axios.get<GetClassifiersApiResponse>(url).then(({ data: { classifiers } }) => classifiers)
}

export const useClassifiers = ({ typeName, code }: UseClassifiersProps) => {
  return useQuery<Classifier[], Error>([CLASSIFIERS_QUERY_KEY, typeName, code], () =>
    fetchClassifiers({ typeName, code })
  )
}
