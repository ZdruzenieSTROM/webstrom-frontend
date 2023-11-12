export type Styles = {
  footer: string
  grid: string
  content: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
