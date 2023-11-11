export type Styles = {
  actions: string
  image: string
  imageContainer: string
  problem: string
  problemTitle: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
