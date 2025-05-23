import {Visibility, VisibilityOff} from '@mui/icons-material'
import {IconButton, Stack, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'
import {SubmitHandler, useForm, useFormState} from 'react-hook-form'

import {apiAxios} from '@/api/apiAxios'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {IGeneralPostResponse} from '@/types/api/general'
import {useAlert} from '@/utils/useAlert'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {useNavigationTrap} from '../../utils/useNavigationTrap'
import {Button} from '../Clickable/Button'
import {Link} from '../Clickable/Link'
import {Dialog} from '../Dialog/Dialog'
import {SchoolSubForm, SchoolSubFormValues} from '../SchoolSubForm/SchoolSubForm'

interface RegisterFormValues extends SchoolSubFormValues {
  email?: string
  password1?: string
  password2?: string
  first_name?: string
  last_name?: string
  phone?: string
  parent_phone?: string
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
  grade: null,
}

export const RegisterForm: FC = () => {
  const {handleSubmit, control, watch, setValue, getValues, setError} = useForm<RegisterFormValues>({
    defaultValues,
    values: defaultValues,
  })

  const {isDirty} = useFormState<RegisterFormValues>({control: control})

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const router = useRouter()

  const {seminar} = useSeminarInfo()
  const {alert} = useAlert()

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
      grade: data.grade?.id,
    },
    new_school_description: data.new_school_description || '',
  })

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: RegisterFormValues) => {
      return apiAxios.post<IGeneralPostResponse>(`/user/registration?seminar=${seminar}`, transformFormData(data))
    },
    // TODO: show alert/toast and redirect to homepage instead of redirect to info page
    onSuccess: () =>
      alert(
        'Verifikačný e-mail bol odoslaný na zadanú e-mailovú adresu. Ak ho do pár minút neuvidíš, skontroluj, či ti náhodou neprišiel do priečinku spam.',
        {
          title: 'Registrácia',
          onCloseCallback: () => {
            setOverride(true)
            router.push(`${router.asPath}/../`)
          },
        },
      ),
    onError: (error: AxiosError<RegisterErrorResponseData>) => {
      if (error.response?.status === 400) {
        if (error.response.data.email) {
          setError('email', {type: 'custom', message: `* ${error.response.data.email[0]}`})
        }
      } else {
        alert('Neznáma chyba pri registrácii. Skús to prosím neskôr.')
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
        return '* Zadaj telefónne číslo vo formáte s predvoľbou (napr. +421 123 456 789).'
    },
  }

  const [dialogOpen, setDialogOpen] = useState(false)

  const {continueNavigation, setOverride} = useNavigationTrap({
    shouldBlockNavigation: isDirty,
    onNavigate: () => {
      setDialogOpen(true)
    },
  })

  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  return (
    <>
      <Dialog
        open={dialogOpen}
        title="Neuložené zmeny"
        contentText="Máš neuložené zmeny. Naozaj chceš opustiť stránku?"
        actions={
          <>
            <Button variant="button2" onClick={continueNavigation}>
              Opustiť stránku
            </Button>
            <Button
              variant="button2"
              onClick={() => {
                setDialogOpen(false)
              }}
            >
              Zostať na stránke
            </Button>
          </>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <FormInput
            control={control}
            name="email"
            label="e-mail*"
            rules={{
              ...requiredRule,
              pattern: {
                value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/iu,
                message: '* Vlož správnu emailovú adresu.',
              },
            }}
          />
          <FormInput
            control={control}
            name="password1"
            label="heslo*"
            type={showPassword1 ? 'text' : 'password'}
            rules={{
              ...requiredRule,
              minLength: {
                value: 8,
                message: '* Toto heslo je príliš krátke. Musí obsahovať aspoň 8 znakov.',
              },
            }}
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
            name="password2"
            label="potvrdenie hesla*"
            type={showPassword2 ? 'text' : 'password'}
            rules={{
              ...requiredRule,
              validate: (val) => {
                if (val !== getValues().password1) return '* Zadané heslá sa nezhodujú.'
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
          <FormInput control={control} name="first_name" label="krstné meno*" rules={requiredRule} />
          <FormInput control={control} name="last_name" label="priezvisko*" rules={requiredRule} />
          <SchoolSubForm control={control} watch={watch} setValue={setValue} gap={2} />
          <FormInput control={control} name="phone" label="telefón v tvare +421 ..." rules={phoneRule} />
          <FormInput control={control} name="parent_phone" label="telefón na rodiča" rules={phoneRule} />
          <Typography variant="body2" fontWeight={800} mx={2} sx={{textTransform: 'uppercase'}}>
            * takto označené polia sú povinné
          </Typography>
          <Typography variant="body2">
            Vyplnením a odoslaním registrácie beriem na vedomie, že moje osobné údaje budú spracované v súlade so
            zákonom o ochrane osobných údajov. Bližšie informácie
            <Link href={`./gdpr`} target="_blank">
              nájdete tu
            </Link>
            .
          </Typography>
          <Stack direction="row" justifyContent="flex-end" mt={3}>
            <Button variant="button2" type="submit" onClick={scrollToTop}>
              Registrovať
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  )
}
