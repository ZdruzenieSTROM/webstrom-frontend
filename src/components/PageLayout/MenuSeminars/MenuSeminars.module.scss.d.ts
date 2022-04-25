export type Styles = {
  active: string
  container: string
  menu: string
  menuItem: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
