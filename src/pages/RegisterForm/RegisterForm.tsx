// import './RegisterForm.css'
import {Button} from '@material-ui/core'
import axios from 'axios'
import React, {FC, useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {FormCheckbox} from '../../components/FormItems/FormCheckbox/FormCheckbox'
import {FormInput} from '../../components/FormItems/FormInput/FormInput'
import {FormSelect, SelectOption} from '../../components/FormItems/FormSelect/FormSelect'
import {IGrade} from '../../types/api/competition'
import {IGeneralPostResponse} from '../../types/api/general'
import {ICounty, IDistrict, ISchool} from '../../types/api/personal'

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
  school: number | ''
  school_not_found: boolean
  grade: number | ''
  gdpr: boolean
}

const defaultValues: RegisterFormValues = {
  without_school: false,
  county: '',
  district: '',
  school: '',
  school_not_found: false,
  grade: '',
  gdpr: false,
}

export const RegisterForm: FC = () => {
  const {handleSubmit, control, watch, setValue} = useForm<RegisterFormValues>({defaultValues})
  const {county, district, school_not_found, without_school} = watch([
    'county',
    'district',
    'school_not_found',
    'without_school',
  ])

  const [gradeItems, setGradeItems] = useState<SelectOption[]>([])
  const [schoolItems, setSchoolItems] = useState<SelectOption[]>([])
  const [districtItems, setDistrictItems] = useState<SelectOption[]>([])
  const [countyItems, setCountyItems] = useState<SelectOption[]>([])

  const [emptySchoolItems, setEmptySchoolItems] = useState<SelectOption[]>([])

  const [successfulRegistration, setSuccessfulRegistration] = useState('')

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchData = async () => {
      const grades = await axios.get<IGrade[]>(`/api/competition/grade/`)
      setGradeItems(grades.data.map(({id, name}) => ({id, label: name})))
    }
    fetchData()
  }, [])

  // iniciálne načítanie škôl z BE, ktorými vyplníme FormSelect so školami
  useEffect(() => {
    const fetchData = async () => {
      const schools = await axios.get<ISchool[]>(`/api/personal/schools/?district=0`)
      setEmptySchoolItems(schools.data.map(({code, name}) => ({id: code, label: name})))
    }
    fetchData()
  }, [])

  // načítanie krajov z BE, ktorými vyplníme FormSelect s krajmi
  useEffect(() => {
    const fetchData = async () => {
      const counties = await axios.get<ICounty[]>(`/api/personal/counties/`)
      setCountyItems(counties.data.map(({code, name}) => ({id: code, label: name})))
    }
    fetchData()
  }, [])

  // načítanie okresov z BE, ktorými vyplníme FormSelect s okresmi (naviazené na zmenu číselníku s krajom)
  useEffect(() => {
    const fetchData = async () => {
      if (county !== '') {
        const districts = await axios.get<IDistrict[]>(`/api/personal/districts/?county=${county}`)
        setDistrictItems(districts.data.map(({code, name}) => ({id: code, label: name})))
      }
      county === 0 ? setValue('district', 0) : setValue('district', '')
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
      }
      district === 0 ? setValue('school', 1) : setValue('school', '')
    }
    fetchData()
  }, [district, setValue])

  // predvyplnenie/zmazania hodnôt pri zakliknutí checkboxov pre neznámu školu/užívateľa po škole
  useEffect(() => {
    if (school_not_found) {
      setSchoolItems(emptySchoolItems)
      setValue('school', 0)
    } else if (without_school) {
      setValue('county', 0)
      setValue('grade', 13)
    } else {
      setValue('county', '')
      setValue('district', '')
      setValue('school', '')
      setValue('grade', '')
    }
  }, [school_not_found, without_school, emptySchoolItems, setValue])

  const transformFormData = (data: RegisterFormValues) => ({
    email: data.email,
    password1: data.password1,
    password2: data.password2,
    profile: {
      first_name: data.first_name,
      last_name: data.last_name,
      nickname: data.nickname,
      school: data.school,
      phone: data.phone,
      parent_phone: data.parent_phone,
      gdpr: data.gdpr,
      grade: data.grade,
    },
    new_school_description: data.new_school_description || '',
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      const response = await axios.post<IGeneralPostResponse>(`/api/user/registration/`, transformFormData(data))
      setSuccessfulRegistration(response.data.detail)
    } catch (error: unknown) {
      // TODO: error handling
      return
    }
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>
      {successfulRegistration ? (
        <p>{successfulRegistration}</p>
      ) : (
        <>
          <form>
            <FormInput control={control} name="email" label="Email" />
            <FormInput control={control} name="password1" label="Heslo" type="password" />
            <FormInput control={control} name="password2" label="Potvrdenie hesla" type="password" />
            <FormInput control={control} name="first_name" label="Krstné meno" />
            <FormInput control={control} name="last_name" label="Priezvisko" />
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
            <FormSelect
              control={control}
              name="school"
              label="Škola"
              options={schoolItems}
              disabled={!schoolItems.length || school_not_found || without_school}
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
              />
            )}
            <FormSelect control={control} name="grade" label="Ročník" options={gradeItems} disabled={without_school} />
            <FormInput control={control} name="phone" label="Telefónne číslo" />
            <FormInput control={control} name="parent_phone" label="Telefónne číslo na rodiča" />
            <FormCheckbox control={control} name="gdpr" label="Súhlas so spracovaním osobných údajov" />
          </form>
          <br />
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            Registrovať
          </Button>
        </>
      )}
    </div>
  )
}
