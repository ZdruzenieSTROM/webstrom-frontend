export type Styles = {
  next: string
  root: string
  tooltip: string
  tooltiptext: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
