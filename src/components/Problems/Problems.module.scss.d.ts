export type Styles = {
  actionButton: string
  actions: string
  commentActions: string
  container: string
  disabled: string
  dropzone: string
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
