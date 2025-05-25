import {Stack} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {apiAxios} from '@/api/apiAxios'
import {Button} from '@/components/Clickable/Button'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'

type PasswordResetRequestFormValues = {
  email: string
}

const defaultValues: PasswordResetRequestFormValues = {
  email: '',
}

type PasswordResetRequestFormmProps = {
  closeDialog: () => void
}

export const PasswordResetRequestForm: FC<PasswordResetRequestFormmProps> = ({closeDialog}) => {
  const {handleSubmit, control} = useForm<PasswordResetRequestFormValues>({defaultValues})

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: PasswordResetRequestFormValues) => {
      return apiAxios.post<IGeneralPostResponse>('/user/password/reset', data)
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
          autoComplete="username"
          rules={{
            ...requiredRule,
            pattern: {
              value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/iu,
              message: '* Vložte správnu emailovú adresu.',
            },
          }}
        />
        <Stack alignItems="end">
          <Button variant="button2" type="submit">
            Resetovať heslo
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
