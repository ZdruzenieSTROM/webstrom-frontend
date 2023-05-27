import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useEffect, useRef, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import styles from '@/components/FormItems/Form.module.scss'
import {FormAutocomplete} from '@/components/FormItems/FormAutocomplete/FormAutocomplete'
import {FormCheckbox} from '@/components/FormItems/FormCheckbox/FormCheckbox'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {FormSelect, SelectOption} from '@/components/FormItems/FormSelect/FormSelect'
import {IGrade} from '@/types/api/competition'
import {IGeneralPostResponse} from '@/types/api/general'
import {ICounty, IDistrict, ISchool} from '@/types/api/personal'

import {Button} from '../Clickable/Clickable'

type RegisterFormValues = {
  email?: string
  password1?: string
  password2?: string
  first_name?: string
  last_name?: string
  nickname?: string
  phone?: string
  parent_phone?: string
  new_school_description?: string
  without_school: boolean
  county: number | ''
  district: number | ''
  school?: SelectOption | null
  school_not_found: boolean
  grade: number | ''
  gdpr: boolean
}

const defaultValues: RegisterFormValues = {
  email: '',
  password1: '',
  password2: '',
  first_name: '',
  last_name: '',
  nickname: '',
  phone: '',
  parent_phone: '',
  new_school_description: '',
  without_school: false,
  county: '',
  district: '',
  school: null,
  school_not_found: false,
  grade: '',
  gdpr: false,
}

export const RegisterForm: FC = () => {
  const {handleSubmit, control, watch, setValue, getValues} = useForm<RegisterFormValues>({defaultValues})
  const [county, district, school_not_found, without_school] = watch([
    'county',
    'district',
    'school_not_found',
    'without_school',
  ])

  const [gradeItems, setGradeItems] = useState<SelectOption[]>([])
  const [schoolItems, setSchoolItems] = useState<SelectOption[]>([])
  const [districtItems, setDistrictItems] = useState<SelectOption[]>([])
  const [countyItems, setCountyItems] = useState<SelectOption[]>([])

  const emptySchoolItems = useRef<SelectOption[]>([])
  const otherSchoolItem = useRef<SelectOption>()
  const withoutSchoolItem = useRef<SelectOption>()

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchData = async () => {
      const grades = await axios.get<IGrade[]>(`/api/competition/grade`)
      setGradeItems(grades.data.map(({id, name}) => ({id, label: name})))
    }
    fetchData()
  }, [])

  // iniciálne načítanie škôl z BE, ktorými vyplníme FormAutocomplete so školami v istych prípadoch
  useEffect(() => {
    const fetchData = async () => {
      const schools = await axios.get<ISchool[]>(`/api/personal/schools/?district=0`)
      emptySchoolItems.current = schools.data.map(({code, name}) => ({id: code, label: name}))
      otherSchoolItem.current = emptySchoolItems.current.find((opt) => opt.id === 0)
      withoutSchoolItem.current = emptySchoolItems.current.find((opt) => opt.id === 1)
    }
    fetchData()
  }, [])

  // načítanie krajov z BE, ktorými vyplníme FormSelect s krajmi
  useEffect(() => {
    const fetchData = async () => {
      const counties = await axios.get<ICounty[]>(`/api/personal/counties`)
      setCountyItems(counties.data.map(({code, name}) => ({id: code, label: name})))
    }
    fetchData()
  }, [])

  // načítanie okresov a škôl z BE, po zmene hodnoty v číselníku s krajom
  useEffect(() => {
    const fetchData = async () => {
      if (county !== '') {
        const districts = await axios.get<IDistrict[]>(`/api/personal/districts/?county=${county}`)
        setDistrictItems(districts.data.map(({code, name}) => ({id: code, label: name})))
      } else {
        setDistrictItems([])
      }
      if (county === 0) {
        // neznamy kraj, takze vyplname neznamy okres, atd...
        setValue('district', 0)
      } else {
        // vyplnili sme novy kraj, nie je defaultny okres
        setValue('district', '')
        if (county !== '') {
          // chceme naplnit aj Autocomplete so skolami
          const schools = await axios.get<ISchool[]>(`/api/personal/schools/?county=${county}`)
          setSchoolItems(
            schools.data.map(({code, city, name, street}) => ({
              id: code,
              label: city ? `${name} ${street}, ${city}` : name,
            })),
          )
        }
      }
    }
    fetchData()
  }, [county, setValue])

  // načítanie škôl z BE, ktorými vyplníme FormSelect so školami (naviazené na zmenu číselníku s okresmi)
  useEffect(() => {
    const fetchData = async () => {
      if (district !== '') {
        const schools = await axios.get<ISchool[]>(`/api/personal/schools/?district=${district}`)
        setSchoolItems(
          schools.data.map(({code, city, name, street}) => ({
            id: code,
            label: city ? `${name} ${street}, ${city}` : name,
          })),
        )
      } else {
        setSchoolItems([])
      }
      district === 0 ? setValue('school', withoutSchoolItem.current) : setValue('school', null)
    }
    fetchData()
  }, [district, setValue])

  // predvyplnenie/zmazania hodnôt pri zakliknutí checkboxov pre neznámu školu/užívateľa po škole
  useEffect(() => {
    if (school_not_found) {
      setSchoolItems(emptySchoolItems.current)
      setValue('school', otherSchoolItem.current)
    } else if (without_school) {
      setValue('county', 0)
      setValue('grade', 13)
    } else {
      setValue('county', '')
      setValue('district', '')
      setValue('school', null)
      setValue('grade', '')
    }
  }, [school_not_found, without_school, setValue])

  const transformFormData = (data: RegisterFormValues) => ({
    email: data.email,
    password1: data.password1,
    password2: data.password2,
    profile: {
      first_name: data.first_name,
      last_name: data.last_name,
      nickname: data.nickname,
      school: data.school?.id,
      phone: data.phone,
      parent_phone: data.parent_phone,
      gdpr: data.gdpr,
      grade: data.grade,
    },
    new_school_description: data.new_school_description || '',
  })

  const {mutate: submitFormData, data: registrationResponseData} = useMutation({
    mutationFn: (data: RegisterFormValues) => {
      return axios.post<IGeneralPostResponse>(`/api/user/registration`, transformFormData(data))
    },
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    submitFormData(data)
  }

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}
  const phoneRule = {
    validate: (val?: string) => {
      if (val && !/^(\+\d{10,12})$/u.test(val.replaceAll(/\s+/gu, '')))
        return '* Zadaj telefónne číslo vo formáte validnom formáte +421 123 456 789 alebo +421123456789.'
    },
  }

  return (
    <div>
      {registrationResponseData?.data.detail ? (
        <p>{registrationResponseData?.data.detail}</p>
      ) : (
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
          <FormInput
            control={control}
            name="password1"
            label="Heslo"
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
            label="Potvrdenie hesla"
            type="password"
            rules={{
              ...requiredRule,
              validate: (val) => {
                if (val !== getValues().password1) return '* Zadané heslá sa nezhodujú.'
              },
            }}
          />
          <FormInput control={control} name="first_name" label="Krstné meno" rules={requiredRule} />
          <FormInput control={control} name="last_name" label="Priezvisko" rules={requiredRule} />
          <FormInput control={control} name="nickname" label="Prezývka" />
          <FormCheckbox
            control={control}
            name="without_school"
            label="Už nie som študent základnej ani strednej školy."
          />
          <FormSelect
            control={control}
            name="county"
            label="Kraj školy"
            options={countyItems}
            disabled={school_not_found || without_school}
          />
          <FormSelect
            control={control}
            name="district"
            label="Okres školy"
            options={districtItems}
            disabled={!districtItems.length || school_not_found || without_school}
          />
          <FormAutocomplete
            control={control}
            name="school"
            label="Škola"
            options={schoolItems}
            disabled={!schoolItems.length || school_not_found || without_school}
            rules={requiredRule}
          />
          <FormCheckbox
            control={control}
            name="school_not_found"
            label="Moja škola sa v zozname nenachádza."
            disabled={district === '' || without_school}
          />
          {school_not_found && (
            <FormInput
              control={control}
              name="new_school_description"
              label="povedz nám, kam chodíš na školu, aby sme ti ju mohli dodatočne pridať"
              rules={school_not_found ? requiredRule : {}}
            />
          )}
          <FormSelect
            control={control}
            name="grade"
            label="Ročník"
            options={gradeItems}
            disabled={without_school}
            rules={requiredRule}
          />
          <FormInput control={control} name="phone" label="Telefónne číslo" rules={phoneRule} />
          <FormInput control={control} name="parent_phone" label="Telefónne číslo na rodiča" rules={phoneRule} />
          <FormCheckbox
            control={control}
            name="gdpr"
            label="Súhlas so spracovaním osobných údajov"
            rules={{
              validate: (val) => {
                if (!val) return '* Súhlas so spracovaním osobných údajov je nutnou podmienkou registrácie.'
              },
            }}
          />
          <Button type="submit">Registrovať</Button>
        </form>
      )}
    </div>
  )
}
