import {Visibility, VisibilityOff} from '@mui/icons-material'
import {IconButton, Stack} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {FC, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {apiAxios} from '@/api/apiAxios'
import {IGeneralPostResponse} from '@/types/api/general'
import {useAlert} from '@/utils/useAlert'

import {Button} from '../Clickable/Button'
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
  const {alert} = useAlert()

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
      return apiAxios.post<IGeneralPostResponse>(`/user/password/change`, data)
    },
    onSuccess: onSuccess,
    onError: onError,
  })

  const onSubmit: SubmitHandler<PasswordChangeDialogValues> = async (data) => {
    submitFormData(data)
  }

  const onClose = () => {
    reset()
    close()
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [showPassword3, setShowPassword3] = useState(false)

  return (
    <Dialog
      open={open}
      close={close}
      title="Zmena hesla"
      actions={
        <>
          <Button variant="button2" type="submit" onClick={handleSubmit(onSubmit)}>
            Potvrdiť
          </Button>
          <Button variant="button2" onClick={onClose}>
            Zavrieť
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} mt={4} height="350px">
          <FormInput
            control={control}
            name="old_password"
            label="aktuálne heslo"
            type={showPassword1 ? 'text' : 'password'}
            rules={requiredRule}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword1(!showPassword1)}>
                  {showPassword1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <FormInput
            control={control}
            name="new_password1"
            label="nové heslo"
            type={showPassword2 ? 'text' : 'password'}
            rules={{
              ...requiredRule,
              minLength: {
                value: 8,
                message: '* Toto heslo je príliš krátke. Musí obsahovať aspoň 8 znakov.',
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword2(!showPassword2)}>
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <FormInput
            control={control}
            name="new_password2"
            label="nové heslo znovu"
            type={showPassword3 ? 'text' : 'password'}
            rules={{
              ...requiredRule,
              validate: (val) => {
                if (val !== getValues().new_password1) return '* Zadané heslá sa nezhodujú.'
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword3(!showPassword3)}>
                  {showPassword3 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </Stack>
      </form>
    </Dialog>
  )
}
