export type Styles = {
  p: string
  table: string
  td: string
  th: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
