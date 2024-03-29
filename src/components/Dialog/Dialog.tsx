import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import {FC, ReactNode} from 'react'

type DialogProps = {
  open: boolean
  close: () => void
  title?: ReactNode
  contentText?: ReactNode
  actions?: ReactNode
}

// inspired by: https://mui.com/material-ui/react-dialog/#alerts
export const Dialog: FC<DialogProps> = ({open, close, title, contentText, actions}) => {
  return (
    <MuiDialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{border: '10px solid black'}}
    >
      {title && (
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h2">{title}</Typography>
        </DialogTitle>
      )}
      {contentText && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{contentText}</DialogContentText>
        </DialogContent>
      )}
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  )
}
