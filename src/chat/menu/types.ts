export type MenuKey = 'message' | 'contact' | 'more'| string
export interface Menu {
  key: MenuKey
  icon: string
  activeIcon: string
  active: boolean
}
