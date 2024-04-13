import {Dialog as MuiDialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import {FC, ReactNode} from 'react'

type DialogProps = {
  open: boolean
  close: () => void
  title?: ReactNode
  contentText?: string
  children?: ReactNode
  actions?: ReactNode
}

// inspired by: https://mui.com/material-ui/react-dialog/#alerts
export const Dialog: FC<DialogProps> = ({open, close, title, contentText, children, actions}) => {
  return (
    <MuiDialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && (
        <DialogTitle id="alert-dialog-title" variant="h2">
          {title}
        </DialogTitle>
      )}
      {(contentText || children) && (
        <DialogContent>
          {contentText && <DialogContentText id="alert-dialog-description">{contentText}</DialogContentText>}
          {children}
        </DialogContent>
      )}
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  )
}
