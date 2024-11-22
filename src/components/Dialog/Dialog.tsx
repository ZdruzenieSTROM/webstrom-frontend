import {Box, Dialog as MuiDialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import {FC, ReactNode} from 'react'

import {CloseButton} from '../CloseButton/CloseButton'

type DialogProps = {
  open: boolean
  close?: () => void
  title?: ReactNode
  contentText?: string
  children?: ReactNode
  actions?: ReactNode
}

// inspired by: https://mui.com/material-ui/react-dialog/#alerts
export const Dialog: FC<DialogProps> = ({open, close, title, contentText, children, actions}) => {
  return (
    <MuiDialog open={open} onClose={close}>
      {close && (
        <Box position="absolute" top={16} right={16}>
          <CloseButton size={30} onClick={close} invertColors />
        </Box>
      )}
      {title && <DialogTitle variant="h2">{title}</DialogTitle>}
      {(contentText || children) && (
        <DialogContent>
          {contentText && <DialogContentText>{contentText}</DialogContentText>}
          {children}
        </DialogContent>
      )}
      {/* MUI aplikuje nejaky default spacing, ale u nas je to kontraproduktivne, lebo globalne v teme
          mame `flexDirection:'row-reverse'`. preto `disableSpacing` */}
      {actions && <DialogActions disableSpacing>{actions}</DialogActions>}
    </MuiDialog>
  )
}
