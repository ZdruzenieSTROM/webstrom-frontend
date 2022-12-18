import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {Button} from '@/components/Clickable/Clickable'
import styles from '@/components/FormItems/Form.module.scss'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {AuthContainer} from '@/utils/AuthContainer'

type LoginFormValues = {
  email: string
  password: string
}

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
}

interface ILoginForm {
  closeOverlay: () => void
}

export const LoginForm: FC<ILoginForm> = ({closeOverlay}) => {
  const {login} = AuthContainer.useContainer()
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<LoginFormValues>({defaultValues})

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    await login(data, closeOverlay)
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

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
        fieldError={errors.email}
      />
      <FormInput
        control={control}
        name="password"
        label="Heslo"
        type="password"
        rules={requiredRule}
        fieldError={errors.password}
      />
      <button type="submit">
        <Button>Prihlásiť</Button>
        {/* <span className={styles.underline}>Prihlásiť</span> */}
      </button>
    </form>
  )
}
