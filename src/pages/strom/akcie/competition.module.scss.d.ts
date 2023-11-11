export type Styles = {
  actionButton: string
  actions: string
  archiveWithoutPublications: string
  archiveWithPublications: string
  commentActions: string
  container: string
  disabled: string
  h2: string
  mainText: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
