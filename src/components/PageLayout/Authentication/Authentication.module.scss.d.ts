export type Styles = {
  active: string
  authenticationContainer: string
  authenticationDisplayButtons: string
  content: string
  tabs: string
  underline: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
