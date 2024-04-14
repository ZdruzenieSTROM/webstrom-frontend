import {Stack} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {Dialog} from '@/components/Dialog/Dialog'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {AuthContainer} from '@/utils/AuthContainer'
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

  const [displayForgottenDialog, setDisplayForgottenDialog] = useState(false)
  const toggleForgottenDialog = () => {
    setDisplayForgottenDialog((prev) => !prev)
  }

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
          <Stack direction={'row'} mt={3} gap={2} justifyContent="space-between">
            <Stack direction={'column'} gap={2}>
              <Button variant="button3" type="button" onClick={toggleForgottenDialog}>
                Zabudol som heslo
              </Button>
              <Link variant="button3" href={`${seminar}/registracia`}>
                Chcem sa registrovať
              </Link>
            </Stack>
            <Stack direction={'column-reverse'} gap={2}>
              <Button variant="button2" type="submit">
                Prihlásiť sa
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </>
  )
}
