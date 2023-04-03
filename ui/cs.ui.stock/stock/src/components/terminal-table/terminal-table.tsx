import React, { UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { Typography } from '@mui/material'
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useTerminalTableQuery } from './terminal-table.hook'
import { Terminal } from 'types/terminal'
import { Toolbar } from '../toolbar/toolbar'
import { TerminalTableProps } from './terminal-table.types'
import { useConfigurationFields } from 'hooks/use-configuration-fields'

export const TerminalTable = ({ filter }: TerminalTableProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizerInstanceRef = useRef<Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null)

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(filter)
  const [sorting, setSorting] = useState<SortingState>([])

  const { data, fetchNextPage, isError, isFetching, isLoading } = useTerminalTableQuery(
    columnFilters,
    sorting
  )

  const { data: configData } = useConfigurationFields()

  const columns = useMemo(() => {
    const columnFields =
      configData?.map((field) => {
        return { accessorKey: field.id, header: field.name }
      }) || []
    const cols: MRT_ColumnDef<Terminal>[] = [...columnFields]
    return cols
  }, [configData])

  const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])

  const totalFetched = flatData.length

  const lastFetchedRows = data?.pages?.slice(-1)[0]?.data?.length || 0

  let fetchRequested = false

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 200px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight != clientHeight &&
          scrollHeight - scrollTop - clientHeight < 200 &&
          lastFetchedRows > 0 &&
          !isFetching &&
          !fetchRequested
        ) {
          fetchRequested = true
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching]
  )

  useEffect(() => {
    if (rowVirtualizerInstanceRef.current) {
      try {
        // This try-catch block was added because of a filtering-related bug in Tanstack Virtual
        rowVirtualizerInstanceRef.current?.scrollToIndex?.(0)
      } catch (error) {
        console.error(error)
      }
    }
  }, [sorting, columnFilters])

  useEffect(() => {
    setColumnFilters(filter)
  }, [filter])

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  return (
    <MaterialReactTable
      columns={columns}
      data={flatData}
      enablePagination={false}
      enableGlobalFilter={false}
      enableTopToolbar
      enableRowSelection
      getRowId={(originalRow) => originalRow.id}
      enableRowVirtualization
      manualFiltering
      manualSorting
      renderTopToolbar={({ table }) => (
        <Toolbar selectedRows={table.getSelectedRowModel().rows.map((row) => row.original) || []} />
      )}
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { maxHeight: `${screen.availHeight - 300}px` }, //give the table a max height
        onScroll: (event: UIEvent<HTMLDivElement>) =>
          fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
      muiTableHeadProps={{
        sx: {
          '& th:nth-of-type(1)': {
            borderLeft: '0',
          },
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          borderLeft: '1px solid #dcdcdc',
          borderTop: '1px solid #dcdcdc',
          color: 'primary.main',
          textTransform: 'uppercase',
        },
      }}
      muiTableBodyCellProps={{ sx: { border: 'none' } }}
      onColumnFiltersChange={setColumnFilters}
      onSortingChange={setSorting}
      renderBottomToolbarCustomActions={() => <Typography>Fetched {totalFetched} rows.</Typography>}
      state={{
        columnFilters,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerProps={{ overscan: 12 }}
    />
  )
}
