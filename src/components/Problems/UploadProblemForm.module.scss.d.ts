export type Styles = {
  actions: string
  bottomAction: string
  container: string
  files: string
  problemSubmitted: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
