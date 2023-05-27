export type Styles = {
  col1: string
  col2: string
  col3: string
  grid: string
  mainContent: string
  pageContainer: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
