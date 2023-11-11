export type Styles = {
  adminSection: string
  container: string
  debug: string
  sideContainer: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
