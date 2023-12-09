import {Stack} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'

import {LoginForm} from '../LoginForm/LoginForm'
import {PasswordResetRequestForm} from '../PasswordResetRequest/PasswordResetRequest'

export type LoginFormWrapperProps = {
  closeOverlay: () => void
}

export const LoginFormWrapper: FC<LoginFormWrapperProps> = ({closeOverlay}) => {
  const router = useRouter()
  const [form, changeForm] = useState('login')

  if (form === 'login')
    return (
      <Stack alignItems={'center'} gap={1}>
        <LoginForm closeOverlay={closeOverlay} />
        <Button
          onClick={() => {
            changeForm('reset')
          }}
        >
          Zabudnuté heslo
        </Button>
      </Stack>
    )

  return (
    <PasswordResetRequestForm
      closeOverlay={() => {
        router.push(`${router.asPath}/../verifikacia`)
      }}
    />
  )
}
