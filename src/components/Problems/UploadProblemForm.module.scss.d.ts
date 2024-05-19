export type Styles = {
  actions: string
  bottomAction: string
  container: string
  files: string
  inputWrapper: string
  problemSubmitted: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
