export type Styles = {
  th: string
  td: string
  table: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
