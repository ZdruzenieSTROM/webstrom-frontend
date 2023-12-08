export type Styles = {
  active: string
  container: string
  grid: string
  menu: string
  menuItem: string
  semesterPicker: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
