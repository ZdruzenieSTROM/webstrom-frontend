export type Styles = {
  active: string
  alignRight: string
  closeButton: string
  invertColors: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
