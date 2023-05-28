export type Styles = {
  actions: string
  adminSection: string
  container: string
  debug: string
  image: string
  imageContainer: string
  problem: string
  problemTitle: string
  registerButton: string
  sideContainer: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
