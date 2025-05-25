import {Stack, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {apiAxios} from '@/api/apiAxios'
import {Button} from '@/components/Clickable/Button'
import {IGeneralPostResponse} from '@/types/api/general'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {NewPasswordSubForm, NewPasswordSubFormValues as FormValues} from '../NewPasswordSubForm/NewPasswordSubForm'
import {LoginForm} from '../PageLayout/LoginForm/LoginForm'

export type PasswordResetFormProps = {
  uid: string
  token: string
}

const defaultValues: FormValues = {
  password1: '',
  password2: '',
}

export const PasswordResetForm: FC<PasswordResetFormProps> = ({uid, token}) => {
  const router = useRouter()
  const {seminar} = useSeminarInfo()

  const {handleSubmit, control, getValues} = useForm<FormValues>({defaultValues})

  const transformFormData = (data: FormValues) => {
    return {
      new_password1: data.password1,
      new_password2: data.password2,
      uid: uid,
      token: token,
    }
  }

  const {mutate: submitFormData, isSuccess: isReset} = useMutation({
    mutationFn: (data: FormValues) => {
      return apiAxios.post<IGeneralPostResponse>('/user/password/reset/confirm', transformFormData(data))
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    submitFormData(data)
  }

  if (isReset)
    return (
      <Stack gap={2}>
        <Typography variant="body1">Heslo úspešne zmenené, môžeš sa prihlásiť.</Typography>
        <LoginForm
          closeDialog={() => {
            router.push(`/${seminar}`)
          }}
        />
      </Stack>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3}>
        <Typography variant="body1">Zadaj svoje nové heslo</Typography>
        <NewPasswordSubForm control={control} getValues={getValues} gap={2} />
        <Stack direction={'row'} justifyContent="flex-end">
          <Button variant="button2" type="submit">
            Resetovať heslo
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
