import './RegisterForm.css'

import {Button} from '@material-ui/core'
import axios from 'axios'
import React, {FC, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'

import {FormCheckbox} from '../../components/FormItems/FormCheckbox/FromCheckbox'
import {FormInput} from '../../components/FormItems/FormInput/FormInput'
import {FormSelect, SelectOption} from '../../components/FormItems/FormSelect/FormSelect'

const defaultValues: {
  without_school: boolean
  county: number | ''
  district: number | ''
  school: number | ''
  school_not_found: boolean
  grade: number | ''
  gdpr: boolean
} = {
  without_school: false,
  county: '',
  district: '',
  school: '',
  school_not_found: false,
  grade: '',
  gdpr: false,
}

export const RegisterForm: FC = () => {
  const {handleSubmit, control, watch, setValue} = useForm({defaultValues})
  const fields = watch(Object.keys(defaultValues))

  const [gradeItems, setGradeItems] = useState<SelectOption[]>([])
  const [schoolItems, setSchoolItems] = useState<SelectOption[]>([])
  const [districtItems, setDistrictItems] = useState<SelectOption[]>([])
  const [countyItems, setCountyItems] = useState<SelectOption[]>([])

  const [emptySchoolItems, setEmptySchoolItems] = useState<SelectOption[]>([])

  const [successfullRegistration, setSuccessfullRegistration] = useState<string>('')

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchData = async () => {
      const grades = await axios.get(`/api/competition/grade/`)
      setGradeItems(grades.data.map((grade: any) => ({id: grade.id, label: grade.name})))
    }
    fetchData()
  }, [])

  // iniciálne načítanie ročníkov z BE, ktorými vyplníme FormSelect so školami
  useEffect(() => {
    const fetchData = async () => {
      const schools = await axios.get(`/api/personal/schools/?district=0`)
      setEmptySchoolItems(schools.data.map((school: any) => ({id: school.code, label: school.name})))
    }
    fetchData()
  }, [])

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s krajmi
  useEffect(() => {
    const fetchData = async () => {
      const counties = await axios.get(`/api/personal/counties/`)
      setCountyItems(counties.data.map((county: any) => ({id: county.code, label: county.name})))
    }
    fetchData()
  }, [])

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s okresmi (naviazené na zmenu číselníku s krajom)
  useEffect(() => {
    const fetchData = async () => {
      const districts =
        fields.county !== '' ? await axios.get(`/api/personal/districts/?county=${fields.county}`) : null
      districts && setDistrictItems(districts.data.map((district: any) => ({id: district.code, label: district.name})))
      fields.county === 0 ? setValue('district', 0) : setValue('district', '')
    }
    fetchData()
  }, [fields.county, setValue])

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect so školami (naviazené na zmenu číselníku s okresmi)
  useEffect(() => {
    const fetchData = async () => {
      const schools =
        fields.district !== '' ? await axios.get(`/api/personal/schools/?district=${fields.district}`) : null
      schools &&
        setSchoolItems(
          schools.data.map((school: any) => ({
            id: school.code,
            label: school.city ? `${school.name} ${school.street}, ${school.city}` : school.name,
          })),
        )
      fields.district === 0 ? setValue('school', 1) : setValue('school', '')
    }
    fetchData()
  }, [fields.district, setValue])

  // predvyplnenie/zmazania hodnôt pri zakliknutí checkboxov pre neznámu školu/užívateľa po škole
  useEffect(() => {
    if (fields.school_not_found) {
      setSchoolItems(emptySchoolItems)
      setValue('school', 0)
    } else if (fields.without_school) {
      setValue('county', 0)
      setValue('grade', 13)
    } else {
      setValue('county', '')
      setValue('district', '')
      setValue('school', '')
      setValue('grade', '')
    }
  }, [fields.school_not_found, fields.without_school, emptySchoolItems, setValue])

  const transformFormData = (data: any) => {
    return {
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
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`/api/user/registration/`, transformFormData(data))
      setSuccessfullRegistration(response.data.detail)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>
      {successfullRegistration ? (
        <p>{successfullRegistration}</p>
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
              disabled={fields.school_not_found || fields.without_school}
            />
            <FormSelect
              control={control}
              name="district"
              label="Okres školy"
              options={districtItems}
              disabled={!districtItems.length || fields.school_not_found || fields.without_school}
            />
            <FormSelect
              control={control}
              name="school"
              label="Škola"
              options={schoolItems}
              disabled={!schoolItems.length || fields.school_not_found || fields.without_school}
            />
            <FormCheckbox
              control={control}
              name="school_not_found"
              label="Moja škola sa v zozname nenachádza."
              disabled={fields.district === '' || fields.without_school}
            />
            {fields.school_not_found && (
              <FormInput
                control={control}
                name="new_school_description"
                label="povedz nám, kam chodíš na školu, aby sme ti ju mohli dodatočne pridať"
              />
            )}
            <FormSelect
              control={control}
              name="grade"
              label="Ročník"
              options={gradeItems}
              disabled={fields.without_school}
            />
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
