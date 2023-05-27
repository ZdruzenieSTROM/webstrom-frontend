export type Styles = {
  active: string
  closeButton: string
  closeButtonLeft: string
  closeButtonRight: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
