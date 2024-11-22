export type Styles = {
  textArea: string
  sideContainer: string
  container: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
