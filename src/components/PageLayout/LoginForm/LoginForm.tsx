import {Stack} from '@mui/material'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Button'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {AuthContainer} from '@/utils/AuthContainer'

import {LoginFormWrapperProps} from '../LoginFormWrapper/LoginFormWrapper'

type LoginFormValues = {
  email: string
  password: string
}

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
}

export const LoginForm: FC<LoginFormWrapperProps> = ({closeDialog: closeDialog}) => {
  const {login} = AuthContainer.useContainer()
  const {handleSubmit, control} = useForm<LoginFormValues>({defaultValues})

  const router = useRouter()

  const redirectClose = () => {
    closeDialog()
    if (router.asPath.endsWith('registracia')) {
      router.push('/')
    }
  }

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    login({data, onSuccess: redirectClose})
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack justifyContent="space-between" height="260px">
        <Stack gap={2}>
          <FormInput
            control={control}
            name="email"
            label="Email"
            rules={{
              ...requiredRule,
              pattern: {
                value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/iu,
                message: '* Vložte správnu emailovú adresu.',
              },
            }}
          />
          <FormInput control={control} name="password" label="Heslo" type="password" rules={requiredRule} />
        </Stack>
        <Stack alignItems="center" mt={2}>
          <Button variant="button2" type="submit">
            Prihlásiť
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
