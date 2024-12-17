import {Stack, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {apiAxios} from '@/api/apiAxios'
import {Button} from '@/components/Clickable/Button'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

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
  const {seminar} = useSeminarInfo()

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
      return apiAxios.post<IGeneralPostResponse>('/user/password/reset/confirm', transformFormData(data))
    },
  })

  const onSubmit: SubmitHandler<PasswordResetForm> = (data) => {
    submitFormData(data)
  }

  if (isReset)
    return (
      <Stack gap={2}>
        <Typography variant="body1">Heslo úspešne zmenené, môžeš sa prihlásiť</Typography>
        <LoginForm
          closeDialog={() => {
            router.push(`/${seminar}`)
          }}
        />
      </Stack>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="body1">Zadaj svoje nové heslo</Typography>
      <Stack gap={2} mt={3}>
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
      </Stack>
      <Stack direction={'row'} mt={3} justifyContent="flex-end">
        <Button variant="button2" type="submit">
          Resetovať heslo
        </Button>
      </Stack>
    </form>
  )
}
