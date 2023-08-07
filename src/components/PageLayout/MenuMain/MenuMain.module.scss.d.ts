export type Styles = {
  active: string
  loading: string
  menu: string
  menuButton: string
  menuCloseButton: string
  menuItem: string
  menuItems: string
  menuOpenButton: string
  visible: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
