export type Styles = {
  active: string
  loading: string
  menuButton: string
  menuCloseButton: string
  menuItem: string
  menuOpenButton: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
