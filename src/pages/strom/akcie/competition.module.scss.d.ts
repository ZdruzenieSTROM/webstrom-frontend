export type Styles = {
  archive_without_publications: string
  archive_with_publications: string
  actionButton: string
  actions: string
  commentActions: string
  container: string
  disabled: string
  h2: string
  mainText: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
