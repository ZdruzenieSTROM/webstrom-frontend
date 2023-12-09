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

export const PasswordResetRequestForm: FC<LoginFormWrapperProps> = ({closeOverlay}) => {
  const {handleSubmit, control} = useForm<PasswordResetRequestFormValues>({defaultValues})

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: PasswordResetRequestFormValues) => {
      return axios.post<IGeneralPostResponse>('/api/user/password/reset/', data)
    },

    onError: (error, variables, context) => {},

    onSuccess: () => {
      closeOverlay()
    },
  })

  const onSubmit: SubmitHandler<PasswordResetRequestFormValues> = (data) => {
    submitFormData(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <Button type="submit">Resetovať heslo</Button>
    </form>
  )
}
