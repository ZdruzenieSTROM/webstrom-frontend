import {Stack} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Button'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'

import {LoginFormWrapperProps} from '../LoginFormWrapper/LoginFormWrapper'

type PasswordResetRequestFormValues = {
  email: string
}

const defaultValues: PasswordResetRequestFormValues = {
  email: '',
}

export const PasswordResetRequestForm: FC<LoginFormWrapperProps> = ({closeDialog: closeDialog}) => {
  const {handleSubmit, control} = useForm<PasswordResetRequestFormValues>({defaultValues})

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: PasswordResetRequestFormValues) => {
      return axios.post<IGeneralPostResponse>('/api/user/password/reset', data)
    },

    onSuccess: () => {
      closeDialog()
    },
  })

  const onSubmit: SubmitHandler<PasswordResetRequestFormValues> = (data) => {
    submitFormData(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack justifyContent="space-between" height="160px">
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
        <Stack alignItems="center">
          <Button variant="button2" type="submit">
            Resetovať heslo
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
