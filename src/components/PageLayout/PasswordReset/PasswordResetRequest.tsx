import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Clickable'
import styles from '@/components/FormItems/Form.module.scss'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'

import {ILoginFormWrapper} from '../LoginFormWrapper/LoginFormWrapper'

type PasswordResetRequestFormValues = {
  email: string
}

const defaultValues: PasswordResetRequestFormValues = {
  email: '',
}

export const PasswordResetRequestForm: FC<ILoginFormWrapper> = ({closeOverlay}) => {
  const {handleSubmit, control} = useForm<PasswordResetRequestFormValues>({defaultValues})

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: PasswordResetRequestFormValues) => {
      return axios.post<IGeneralPostResponse>('/api/user/password/reset/', data)
    },
  })

  const onSubmit: SubmitHandler<PasswordResetRequestFormValues> = (data) => {
    submitFormData(data)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
