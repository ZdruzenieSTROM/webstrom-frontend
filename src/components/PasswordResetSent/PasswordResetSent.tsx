import {Typography} from '@mui/material'
import {FC} from 'react'

export const PasswordResetSent: FC = () => {
  return (
    <Typography variant="body1">
      Ak existuje účet so zadaným e-mailom, poslali sme ti naňho link pre zmenu hesla.
    </Typography>
  )
}
