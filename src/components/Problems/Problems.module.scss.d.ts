export type Styles = {
  actions: string
  container: string
  dropzone: string
  loading: string
  menu: string
  notPublished: string
  problem: string
  problemSubmission: string
  problemTitle: string
  registerButton: string
  sideContainer: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
