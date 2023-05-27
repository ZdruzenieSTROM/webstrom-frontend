export type Styles = {
  arrow: string
  displayOptions: string
  dropdown: string
  grade: string
  menu: string
  name: string
  nameAndSchool: string
  option: string
  options: string
  rank: string
  results: string
  rowWrapper: string
  score: string
  selectedOption: string
  school: string
  subtotal: string
  totalScore: string
  votes: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
