export type Styles = {
  comment: string
  commentActions: string
  comments: string
  container: string
  notPublished: string
  textArea: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
