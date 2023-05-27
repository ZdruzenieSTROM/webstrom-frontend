export type Styles = {
  centerCell: string
  container: string
  icon: string
  iconDisabled: string
  input: string
  rightButton: string
  table: string
  tableBody: string
  tableHeader: string
  tableRow: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
