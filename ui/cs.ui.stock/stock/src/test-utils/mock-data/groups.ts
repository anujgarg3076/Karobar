import { GroupStatistics } from 'components/sidebar/tab-label/tab-label.types';

export const MOCK_GROUPS: GroupStatistics[] =  [
  {
      name: "DEFAULT",
      statistics: [
          {
              name: "INSTALLED",
              value: 2
          },
          {
              name: "IN-STOCK",
              value: 3
          }
      ]
  },
  {
      name: "POS",
      statistics: [
          {
              name: "INSTALLED",
              value: 4
          },
          {
              name: "IN-STOCK",
              value: 2
          }
      ]
  }
]
