import './RegisterForm.css'

import {Button} from '@material-ui/core'
import React from 'react'
import {useForm} from 'react-hook-form'

import FormCheckbox from '../../components/FormItems/FormCheckbox/FromCheckbox'
import FormInput from '../../components/FormItems/FormInput/FormInput'

const RegisterForm: React.FC = () => {
  const {handleSubmit, control} = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>

      <form>
        <FormInput control={control} name="email" label="Email" required />
        <FormInput control={control} name="password1" label="Heslo" type="password" required />
        <FormInput control={control} name="password2" label="Potvrdenie hesla" type="password" required />
        <FormInput control={control} name="first_name" label="Krstné meno" required />
        <FormInput control={control} name="last_name" label="Priezvisko" required />
        <FormInput control={control} name="nickname" label="Prezývka" />
        <FormInput control={control} name="school" label="Škola" required />
        <FormInput control={control} name="year_of_graduation" label="Ročník" required />
        <FormInput control={control} name="phone" label="Telefónne číslo" />
        <FormInput control={control} name="parent_phone" label="Telefónne číslo na rodiča" />
        <FormCheckbox control={control} name="gdpr" label="Súhlas so spracovaním osobných údajov" required />
      </form>

      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
        Registrovať
      </Button>
    </div>
  )
}

export default RegisterForm
