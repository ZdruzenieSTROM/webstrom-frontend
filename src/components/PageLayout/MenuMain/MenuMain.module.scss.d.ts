export type Styles = {
  active: string
  menu: string
  menuCloseButton: string
  menuItem: string
  menuItems: string
  menuOpenButton: string
  visible: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
