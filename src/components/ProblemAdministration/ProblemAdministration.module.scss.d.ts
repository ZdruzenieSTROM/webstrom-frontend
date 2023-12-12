export type Styles = {
  centerCell: string
  icon: string
  iconDisabled: string
  input: string
  row: string
  table: string
  tableBody: string
  tableHeader: string
  tableRow: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
