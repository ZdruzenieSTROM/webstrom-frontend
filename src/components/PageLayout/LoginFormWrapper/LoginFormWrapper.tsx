import {Stack} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {LoginForm} from '../LoginForm/LoginForm'
import {PasswordResetRequestForm} from '../PasswordResetRequest/PasswordResetRequest'

export type LoginFormWrapperProps = {
  closeDialog: () => void
}

export const LoginFormWrapper: FC<LoginFormWrapperProps> = ({closeDialog}) => {
  const router = useRouter()
  const [form, changeForm] = useState('login')

  const {seminar} = useSeminarInfo()

  if (form === 'login')
    return (
      <Stack gap={2}>
        <LoginForm closeDialog={closeDialog} />
        <Stack alignItems="center" mt={2}>
          <Button
            onClick={() => {
              changeForm('reset')
            }}
          >
            Zabudnuté heslo
          </Button>
        </Stack>
      </Stack>
    )

  return (
    <Stack gap={2}>
      <PasswordResetRequestForm
        closeDialog={() => {
          router.push(`/${seminar}/reset-sent`)
        }}
      />
      <Stack alignItems="center" mt={2}>
        <Button
          onClick={() => {
            changeForm('login')
          }}
        >
          Prihlásenie
        </Button>
      </Stack>
    </Stack>
  )
}
