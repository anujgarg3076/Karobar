import {
  StateChangePostApiResponse,
  PostTerminalsApiResponse,
  PatchTerminalsApiResponse,
  PatchTerminalsApiRequestData,
} from 'types/api'
import { MOCK_STOCK_LOCATIONS } from 'test-utils/mock-data/classifiers'
import { BaseTerminalData, StateChangeData } from 'types/terminal'
import { Server } from 'miragejs'
import { MOCK_TERMINAL_TYPES } from 'test-utils/mock-data/terminal-types'
import { MOCK_TERMINALS } from 'test-utils/mock-data/terminals'
import { MOCK_CONFIGURATION_FIELDS } from 'test-utils/mock-data/configuration-types'
import { MOCK_GROUPS } from 'test-utils/mock-data/groups'

// This is fake REST API provider within development mode.
// function isn't bundled in production build

export const loadMirageServerInDevelepomentMode = () => {
  if (process.env.NODE_ENV === 'development') {
    return new Server({
      routes() {
        const terminals = [...MOCK_TERMINALS]
        this.urlPrefix = 'http://test/rest'

        // Stub response for http://test/terminals GET request
        this.get(
          '/stock/terminals',
          (_, request) => {
            const qp = request.queryParams
            const start = parseInt(qp.start)
            const size = parseInt(qp.size)
            const end = start + size
            const filtered = terminals.slice(start, end)
            return { data: filtered, status: { type: 'success', message: '' } }
          },
          {
            timing: 1000, //delaying one sec to see the progress bar
          }
        )

        this.post('/stock/terminals', (_, request) => {
          const postJson = JSON.parse(request.requestBody) as BaseTerminalData[]
          const newTerm = {
            ...MOCK_TERMINALS[0],
            id: (terminals.length + 1000).toString(),
            ...postJson[0],
          }
          terminals.push(newTerm)

          const ret: PostTerminalsApiResponse = {
            status: {
              succeeded: {
                count: 1,
                details: [],
              },
              failed: {
                count: 0,
                details: [],
              },
              skipped: {
                count: 0,
                details: [],
              },
            },
          }

          return ret
        })

        this.patch('/stock/terminals', (_, request) => {
          const postJson = JSON.parse(request.requestBody) as PatchTerminalsApiRequestData
          const newTerm = {
            ...MOCK_TERMINALS[0],
            ...postJson,
          }
          terminals.push(newTerm)

          const ret: PatchTerminalsApiResponse = {
            status: {
              succeeded: {
                count: 1,
                details: [],
              },
              failed: {
                count: 0,
                details: [],
              },
              skipped: {
                count: 0,
                details: [],
              },
            },
          }

          return ret
        })

        this.get('/stock/groups', () => {
          return { data: MOCK_GROUPS, status: { type: 'success', message: '' } }
        })

        this.get('/tlms/terminalTypes', () => ({ terminalTypes: MOCK_TERMINAL_TYPES }))

        this.get('/stock/configuration/fields', () => ({
          data: MOCK_CONFIGURATION_FIELDS,
          status: { type: 'success', message: '' },
        }))

        this.post('/stock/events', (_, request) => {
          const postJson = JSON.parse(request.requestBody) as StateChangeData[]
          const idx = terminals.findIndex((t) => t.id === postJson[0].id)
          const nextState =
            MOCK_TERMINAL_TYPES.find((tp) => tp.mediaType === postJson[0].type)?.stateFlows.find(
              (sf) => sf.event === postJson[0].event && sf.state === postJson[0].currentState
            )?.nextState || 'UNDEFINED'
          terminals[idx].state = nextState
          const ret: StateChangePostApiResponse = {
            status: {
              succeeded: {
                count: 1,
                details: [],
              },
              failed: {
                count: 0,
                details: [],
              },
              skipped: {
                count: 0,
                details: [],
              },
            },
          }

          return ret
        })

        this.get('/tlms/classifiers/TLMS_STOCK_LOCATION', () => ({
          classifiers: MOCK_STOCK_LOCATIONS,
        }))
      },
    })
  }
}
