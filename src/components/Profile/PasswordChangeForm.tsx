import {useMutation} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import styles from '@/components/FormItems/Form.module.scss'
import {IGeneralPostResponse} from '@/types/api/general'

import {Button} from '../Clickable/Clickable'
import {Dialog} from '../Dialog/Dialog'
import {FormInput} from '../FormItems/FormInput/FormInput'

type PasswordChangeDialogValues = {
  old_password: string
  new_password1: string
  new_password2: string
}

const defaultValues: PasswordChangeDialogValues = {
  old_password: '',
  new_password1: '',
  new_password2: '',
}

interface PasswordChangeDialogProps {
  open: boolean
  close: () => void
}

interface ChangePasswordErrorResponseData {
  old_password?: string[]
}

export const PasswordChangeDialog: FC<PasswordChangeDialogProps> = ({open, close}) => {
  const {handleSubmit, reset, control, getValues, setError} = useForm<PasswordChangeDialogValues>({defaultValues})

  const onSuccess = () => {
    alert('Zmena hesla prebehla úspešne.')
    reset()
    close()
  }

  const onError = (error: AxiosError<ChangePasswordErrorResponseData>) => {
    if (error.response?.status === 400) {
      if (error.response.data.old_password) {
        setError('old_password', {type: 'manual', message: `* ${error.response.data.old_password[0]}`}) // TODO: We might want to simplify/reword this message
      }
    }
  }

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: PasswordChangeDialogValues) => {
      return axios.post<IGeneralPostResponse>(`/api/user/password/change`, data)
    },
    onSuccess: onSuccess,
    onError: onError,
  })

  const onSubmit: SubmitHandler<PasswordChangeDialogValues> = async (data) => {
    submitFormData(data)
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  return (
    <Dialog
      open={open}
      close={close}
      title="Zmena hesla"
      contentText={
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            control={control}
            name="old_password"
            label="aktuálne heslo"
            type="password"
            rules={requiredRule}
          />
          <FormInput
            control={control}
            name="new_password1"
            label="nové heslo"
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
            name="new_password2"
            label="nové heslo znovu"
            type="password"
            rules={{
              ...requiredRule,
              validate: (val) => {
                if (val !== getValues().new_password1) return '* Zadané heslá sa nezhodujú.'
              },
            }}
          />
        </form>
      }
      actions={
        <>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Potvrdiť
          </Button>
          <Button onClick={close}>Zavrieť</Button>
        </>
      }
    />
  )
}
