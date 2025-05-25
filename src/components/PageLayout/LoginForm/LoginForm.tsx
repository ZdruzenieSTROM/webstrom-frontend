import {Visibility, VisibilityOff} from '@mui/icons-material'
import {Box, IconButton, Stack} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Button'
import {Dialog} from '@/components/Dialog/Dialog'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {AuthContainer} from '@/utils/AuthContainer'
import {useAlert} from '@/utils/useAlert'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {PasswordResetRequestForm} from '../PasswordResetRequest/PasswordResetRequest'

type LoginFormValues = {
  email: string
  password: string
}

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
}

type LoginFormProps = {
  closeDialog: () => void
}

export const LoginForm: FC<LoginFormProps> = ({closeDialog}) => {
  const {login} = AuthContainer.useContainer()
  const {handleSubmit, control} = useForm<LoginFormValues>({defaultValues})
  const {seminar} = useSeminarInfo()
  const {alert} = useAlert()

  const router = useRouter()

  const redirectClose = () => {
    if (router.asPath.endsWith('registracia') || router.asPath.includes('verify-email')) {
      router.push(`/${seminar}`)
    }
    closeDialog()
  }

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    login({data, onSuccess: redirectClose})
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const [displayForgottenDialog, setDisplayForgottenDialog] = useState(false)
  const toggleForgottenDialog = () => {
    setDisplayForgottenDialog((prev) => !prev)
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Dialog open={displayForgottenDialog} close={toggleForgottenDialog} title="Zabudnuté heslo">
        <PasswordResetRequestForm
          closeDialog={() => {
            toggleForgottenDialog()
            closeDialog()
            alert('Ak existuje účet so zadaným e-mailom, poslali sme ti naňho link pre zmenu hesla.')
          }}
        />
      </Dialog>
      <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
        <Stack justifyContent="space-between" height="260px">
          <Stack gap={2}>
            <FormInput
              control={control}
              name="email"
              label="Email"
              autoComplete="username"
              rules={{
                ...requiredRule,
                pattern: {
                  value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/iu,
                  message: '* Vložte správnu emailovú adresu.',
                },
              }}
            />
            <FormInput
              control={control}
              name="password"
              label="Heslo"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              rules={requiredRule}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Box alignSelf="end">
              <Button variant="button3" type="button" onClick={toggleForgottenDialog}>
                Zabudnuté heslo
              </Button>
            </Box>
          </Stack>
          <Stack direction={'row'} mt={3} gap={2} justifyContent="space-between">
            <Button
              variant="button2"
              type="button"
              onClick={() => {
                closeDialog() // We want to force th dialog to close also on the registration page
                router.push(`/${seminar}/registracia`)
              }}
            >
              Registrovať
            </Button>
            <Button variant="button2" type="submit">
              Prihlásiť
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  )
}
