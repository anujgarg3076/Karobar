import { GetTerminalsApiResponse } from '../../types/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { TerminalTableResponse } from './terminal-table.types'
import { TERMINALS_URL, TERMINALS_QUERY_KEY } from '../../constants/api'
import axios from 'axios'
import { ALL_TERMINALS } from './terminal-table.constants'


const toRsql = (columnFilters: ColumnFiltersState) => columnFilters.reduce((acc, cur) => (acc === ALL_TERMINALS ? "" : (acc + " and ")) + cur.id + "==" + cur.value, ALL_TERMINALS)

export const useTerminalTableQuery = (columnFilters: ColumnFiltersState, sorting: SortingState) => {
  const fetchSize = 50

  return useInfiniteQuery<TerminalTableResponse>(
    [TERMINALS_QUERY_KEY, columnFilters, sorting],
    async ({ pageParam = 0 }) => {
      const url = new URL(TERMINALS_URL)

      url.searchParams.set('start', `${pageParam * fetchSize}`)
      url.searchParams.set('size', `${fetchSize}`)
      url.searchParams.set('filters', toRsql(columnFilters))
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []))

      const response = await axios.get<GetTerminalsApiResponse>(url.href)
      const json = response.data.data

      return {
        data: json,
        meta: {
          totalRowCount: json.length,
        },
      }
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )
}
