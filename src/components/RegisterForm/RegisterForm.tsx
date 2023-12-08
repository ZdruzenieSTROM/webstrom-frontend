import {useMutation} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import styles from '@/components/FormItems/Form.module.scss'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Button, Link} from '../Clickable/Clickable'
import {SchoolSubForm, SchoolSubFormValues} from '../SchoolSubForm/SchoolSubForm'

interface RegisterFormValues extends SchoolSubFormValues {
  email?: string
  password1?: string
  password2?: string
  first_name?: string
  last_name?: string
  phone?: string
  parent_phone?: string
  gdpr?: boolean
}

interface RegisterErrorResponseData {
  email?: string[]
}

const defaultValues: RegisterFormValues = {
  email: '',
  password1: '',
  password2: '',
  first_name: '',
  last_name: '',
  phone: '',
  parent_phone: '',
  new_school_description: '',
  without_school: false,
  school: null,
  school_not_found: false,
  grade: '',
  gdpr: false,
}

export const RegisterForm: FC = () => {
  const {handleSubmit, control, watch, setValue, getValues, setError} = useForm<RegisterFormValues>({
    defaultValues,
    values: defaultValues,
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const router = useRouter()

  const {seminar} = useSeminarInfo()

  const transformFormData = (data: RegisterFormValues) => ({
    email: data.email,
    password1: data.password1,
    password2: data.password2,
    profile: {
      first_name: data.first_name,
      last_name: data.last_name,
      school: data.school?.id,
      phone: data.phone?.replaceAll(/\s+/gu, ''),
      parent_phone: data.parent_phone?.replaceAll(/\s+/gu, ''),
      gdpr: data.gdpr,
      grade: data.grade,
    },
    new_school_description: data.new_school_description || '',
  })

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: RegisterFormValues) => {
      return axios.post<IGeneralPostResponse>(`/api/user/registration?seminar=${seminar}`, transformFormData(data))
    },
    onSuccess: () => router.push(`${router.asPath}/../verifikacia`),
    onError: (error: AxiosError<RegisterErrorResponseData>) => {
      if (error.response?.status === 400) {
        if (error.response.data.email) {
          setError('email', {type: 'custom', message: `* ${error.response.data.email[0]}`})
        }
      } else {
        alert('Neznáma chyba pri registrácii. Skúste to prosím neskôr.')
      }
    },
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    submitFormData(data)
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}
  const phoneRule = {
    validate: (val?: string) => {
      if (val && !/^(\+\d{10,12})$/u.test(val.replaceAll(/\s+/gu, '')))
        return '* Zadaj telefónne číslo vo formáte +421 123 456 789 alebo +421123456789.'
    },
  }
  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          control={control}
          name="email"
          label="e-mail*"
          rules={{
            ...requiredRule,
            pattern: {
              value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/iu,
              message: '* Vložte správnu emailovú adresu.',
            },
          }}
        />
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
        <FormInput control={control} name="first_name" label="krstné meno*" rules={requiredRule} />
        <FormInput control={control} name="last_name" label="priezvisko*" rules={requiredRule} />
        <SchoolSubForm control={control} watch={watch} setValue={setValue} />
        <FormInput control={control} name="phone" label="telefónne číslo" rules={phoneRule} />
        <FormInput control={control} name="parent_phone" label="telefónne číslo na rodiča" rules={phoneRule} />
        <p style={{fontWeight: 'bold'}}>* takto označéné polia sú povinné</p>
        <p>
          Vyplnením a odoslaním registrácie beriem na vedomie, že moje osobné údaje budú spracované v súlade so zákonom
          o ochrane osobných údajov. Bližšie informácie nájdete <Link href={`./gdpr`}>tu</Link>.
        </p>
        <Button type="submit" onClick={scrollToTop}>
          Registrovať
        </Button>
      </form>
    </div>
  )
}
