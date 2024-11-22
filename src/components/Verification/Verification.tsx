import {Typography} from '@mui/material'
import {FC} from 'react'

export const Verification: FC = () => {
  return (
    <Typography variant="body1">
      Verifikačný e-mail bol odoslaný na zadanú e-mailovú adresu. Ak ho do pár minút neuvidíš, skontroluj, či ti náhodou
      neprišiel do priečinku spam.
    </Typography>
  )
}
