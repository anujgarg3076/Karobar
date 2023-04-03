const env = process.env.NODE_ENV
export const BASE_URL: RegExpMatchArray | null | string =
  env === 'production'
    ? location.href.match(/http[s]?:\/\/[^/]+\/[^/]+/)
    : process.env.TEST_API || ''

export const TERMINALS_URL = `${BASE_URL}/rest/stock/terminals`
export const GROUPS_URL = `${BASE_URL}/rest/stock/groups`
export const FIELDS_URL = `${BASE_URL}/rest/stock/configuration/fields`
export const TERMINAL_TYPES_URL = `${BASE_URL}/rest/tlms/terminalTypes`
export const EVENTS_URL = `${BASE_URL}/rest/stock/events`
export const CLASSIFIERS_URL = `${BASE_URL}/rest/tlms/classifiers`

export const TERMINALS_QUERY_KEY = 'terminals'
export const GROUPS_QUERY_KEY = 'groups'
export const FIELDS_QUERY_KEY = 'fields'
export const TERMINAL_TYPES_QUERY_KEY = 'terminalTypes'
export const EVENTS_QUERY_KEY = 'events'
export const CLASSIFIERS_QUERY_KEY = 'classifiers'
