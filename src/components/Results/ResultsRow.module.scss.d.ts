export type Styles = {
  grade: string
  name: string
  nameAndSchool: string
  rank: string
  rowWrapper: string
  school: string
  score: string
  subtotal: string
  totalScore: string
  votes: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
