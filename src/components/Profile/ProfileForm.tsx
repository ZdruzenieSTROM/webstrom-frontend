import {Stack} from '@mui/material'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {apiAxios} from '@/api/apiAxios'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {SelectOption} from '@/components/FormItems/FormSelect/FormSelect'
import {IGeneralPostResponse} from '@/types/api/general'
import {useProfile} from '@/utils/useProfile'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Button} from '../Clickable/Button'
import {InlineLink} from '../Clickable/InlineLink'
import {SchoolSubForm, SchoolSubFormValues} from '../SchoolSubForm/SchoolSubForm'

interface ProfileFormValues extends SchoolSubFormValues {
  first_name?: string
  last_name?: string
  phone?: string
  parent_phone?: string
}

const defaultValues: ProfileFormValues = {
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

export const ProfileForm: FC = () => {
  const {profile} = useProfile()

  const profileValues: ProfileFormValues = {
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    phone: profile?.phone ?? '',
    parent_phone: profile?.parent_phone ?? '',
    new_school_description: '',
    without_school: profile?.school_id === 1,
    school: profile ? ({id: profile.school.code, label: profile.school.verbose_name} as SelectOption) : null,
    school_not_found: profile?.school_id === 0,
    grade: profile ? ({id: profile.grade, label: profile.grade_name} as SelectOption) : null,
  }

  const {handleSubmit, control, watch, setValue} = useForm<ProfileFormValues>({
    defaultValues,
    values: profileValues,
  })

  watch(['first_name'])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const router = useRouter()

  const {seminar} = useSeminarInfo()

  const transformFormData = (data: ProfileFormValues) => ({
    profile: {
      school: data.school?.id,
      phone: data.phone?.replaceAll(/\s+/gu, ''),
      parent_phone: data.parent_phone?.replaceAll(/\s+/gu, ''),
      grade: data.grade?.id,
    },
    new_school_description: data.new_school_description || '',
  })

  const queryClient = useQueryClient()

  const {mutate: submitFormData} = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      return apiAxios.patch<IGeneralPostResponse>(`/user/user`, transformFormData(data))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['personal', 'profiles', 'myprofile']})
router.push(`/${seminar}/profil`)
    },
  })

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    submitFormData(data)
  }

  const returnBack = () => {
    router.push(`/${seminar}/profil`)
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}
  const phoneRule = {
    validate: (val?: string) => {
      if (val && !/^(\+\d{10,12})$/u.test(val.replaceAll(/\s+/gu, '')))
        return '* Zadaj telefónne číslo vo formáte +421 123 456 789 alebo +421123456789.'
    },
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <FormInput control={control} name="first_name" label="krstné meno*" rules={requiredRule} disabled={true} />
        <FormInput control={control} name="last_name" label="priezvisko*" rules={requiredRule} disabled={true} />
        <p style={{fontWeight: 'bold', textAlign: 'left'}}>
          Pre zmenu mena a priezviska nám napíšte na:{' '}
          <InlineLink href="mailto:webmaster@strom.sk">webmaster@strom.sk</InlineLink>
        </p>
        <SchoolSubForm control={control} watch={watch} setValue={setValue} gap={2} />
        <FormInput control={control} name="phone" label="telefónne číslo" rules={phoneRule} />
        <FormInput control={control} name="parent_phone" label="telefónne číslo na rodiča" rules={phoneRule} />
        <p style={{fontWeight: 'bold'}}>* takto označené polia sú povinné</p>
        <Stack direction={'row'} mt={3} gap={2} justifyContent="space-between">
          <Button onClick={returnBack} variant="button2" type="button">
            Späť
          </Button>
          <Button type="submit" onClick={scrollToTop} variant="button2">
            Uložiť údaje
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
