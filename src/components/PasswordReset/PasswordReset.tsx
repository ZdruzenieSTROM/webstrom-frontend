import {Stack, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Button'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'

import {LoginForm} from '../PageLayout/LoginForm/LoginForm'

export type PasswordResetFormProps = {
  uid: string
  token: string
}

type PasswordResetForm = {
  password1: string
  password2: string
}

const defaultValues: PasswordResetForm = {
  password1: '',
  password2: '',
}

export const PasswordResetForm: FC<PasswordResetFormProps> = ({uid, token}) => {
  const router = useRouter()

  const {handleSubmit, control, getValues} = useForm<PasswordResetForm>({defaultValues})

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const transformFormData = (data: PasswordResetForm) => {
    return {
      new_password1: data.password1,
      new_password2: data.password2,
      uid: uid,
      token: token,
    }
  }

  const {mutate: submitFormData, isSuccess: isReset} = useMutation({
    mutationFn: (data: PasswordResetForm) => {
      return axios.post<IGeneralPostResponse>('/api/user/password/reset/confirm', transformFormData(data))
    },
  })

  const onSubmit: SubmitHandler<PasswordResetForm> = (data) => {
    submitFormData(data)
  }

  if (isReset)
    return (
      <>
        <Stack gap={2}>
          <Typography variant="body1">Heslo úspešne zmenené, môžeš sa prihlásiť</Typography>
          <LoginForm
            closeOverlay={() => {
              router.push('/')
            }}
          />
        </Stack>
      </>
    )

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <FormInput
            control={control}
            name="password1"
            label="heslo*"
            type="password"
            rules={{
              ...requiredRule,
              minLength: {
                value: 8,
                message: '* Toto heslo je príliš krátke. Musí obsahovať aspoň 8 znakov.',
              },
            }}
          />
          <FormInput
            control={control}
            name="password2"
            label="potvrdenie hesla*"
            type="password"
            rules={{
              ...requiredRule,
              validate: (val) => {
                if (val !== getValues().password1) return '* Zadané heslá sa nezhodujú.'
              },
            }}
          />
          <Stack alignItems="center" mt={2}>
            <Button variant="button2" type="submit">
              Resetovať heslo
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  )
}
