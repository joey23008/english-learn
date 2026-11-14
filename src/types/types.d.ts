type t = typeof import('@/consts').STATUS
type SortDirections = typeof import('@/consts').SORT_DIRECTIONS

type KeyOfStatus = keyof t
type ValueOfStatus = t[keyof t]
type ValueOfSortDirections = SortDirections[number]

declare module 'ConstTypes' {
  export type StatusKey = KeyOfStatus
  export type StatusValue = ValueOfStatus
  export type SortDirectionsValue = ValueOfSortDirections
}

declare type DammyComponentType = {
  className?: string,
  children: React.ReactNode,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}