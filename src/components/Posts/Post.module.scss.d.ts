export type Styles = {
  links: string
  text: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
