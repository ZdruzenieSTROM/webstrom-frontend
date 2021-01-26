import './RegisterForm.css'

import {Button} from '@material-ui/core'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'

import FormCheckbox from '../../components/FormItems/FormCheckbox/FromCheckbox'
import FormInput from '../../components/FormItems/FormInput/FormInput'
import {FormSelect, SelectOption} from '../../components/FormItems/FormSelect/FormSelect'

const defaultValues: {
  school_not: boolean
  county: number | ''
  district: number | ''
  school: number | ''
  school_not_found: boolean
  year_of_graduation: number | ''
  gdpr: boolean
} = {
  school_not: false,
  county: '',
  district: '',
  school: '',
  school_not_found: false,
  year_of_graduation: '',
  gdpr: false,
}

const RegisterForm: React.FC = () => {
  const {handleSubmit, control, watch, setValue} = useForm({defaultValues})
  const fields = watch(Object.keys(defaultValues))

  const [gradeItems, setGradeItems] = useState<SelectOption[]>([])
  const [schoolItems, setSchoolItems] = useState<SelectOption[]>([])
  const [districtItems, setDistrictItems] = useState<SelectOption[]>([])
  const [countyItems, setCountyItems] = useState<SelectOption[]>([])

  const [emptyDistrictItems, setEmptyDistrictItems] = useState<SelectOption[]>([])
  const [emptySchoolItems, setEmptySchoolItems] = useState<SelectOption[]>([])

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchData = async () => {
      const grades = await axios.get(`/api/competition/grade/`)
      setGradeItems(grades.data.map((grade: any) => ({id: grade.id, label: grade.name})))
    }
    fetchData()
  }, [])

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchData = async () => {
      const districts = await axios.get(`/api/personal/districts/?county=0`)
      setEmptyDistrictItems(districts.data.map((districts: any) => ({id: districts.code, label: districts.name})))
      const schools = await axios.get(`/api/personal/schools/?district=0`)
      setEmptySchoolItems(schools.data.map((school: any) => ({id: school.code, label: school.name})))
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const counties = await axios.get(`/api/personal/counties/`)
      setCountyItems(counties.data.map((county: any) => ({id: county.code, label: county.name})))
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const districts =
        fields.county !== '' ? await axios.get(`/api/personal/districts/?county=${fields.county}`) : null
      districts && setDistrictItems(districts.data.map((district: any) => ({id: district.code, label: district.name})))
      fields.county === 0 ? setValue('district', 0) : setValue('district', '')
    }
    fetchData()
  }, [fields.county, setValue])

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

  useEffect(() => {
    if (fields.school_not_found) {
      setSchoolItems(emptySchoolItems)
      setValue('school', 0)
    } else if (fields.school_not) {
      setValue('county', 0)
      setValue('year_of_graduation', 13)
    } else {
      setValue('county', '')
      setValue('district', '')
      setValue('school', '')
      setValue('year_of_graduation', '')
    }
  }, [fields.school_not_found, fields.school_not, emptyDistrictItems, emptySchoolItems, setValue])

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>

      <form>
        <FormInput control={control} name="email" label="Email" />
        <FormInput control={control} name="password1" label="Heslo" type="password" />
        <FormInput control={control} name="password2" label="Potvrdenie hesla" type="password" />
        <FormInput control={control} name="first_name" label="Krstné meno" />
        <FormInput control={control} name="last_name" label="Priezvisko" />
        <FormInput control={control} name="nickname" label="Prezývka" />
        <FormCheckbox control={control} name="school_not" label="Už nie som študent základnej ani strednej školy." />
        <FormSelect
          control={control}
          name="county"
          label="Kraj školy"
          options={countyItems}
          disabled={fields.school_not_found || fields.school_not}
        />
        <FormSelect
          control={control}
          name="district"
          label="Okres školy"
          options={districtItems}
          disabled={!districtItems.length || fields.school_not_found || fields.school_not}
        />
        <FormSelect
          control={control}
          name="school"
          label="Škola"
          options={schoolItems}
          disabled={!schoolItems.length || fields.school_not_found || fields.school_not}
        />
        <FormCheckbox
          control={control}
          name="school_not_found"
          label="Moja škola sa v zozname nenachádza."
          disabled={fields.district === '' || fields.school_not}
        />
        {fields.school_not_found && (
          <FormInput
            control={control}
            name="school_info"
            label="povedz nám, kam chodíš na školu, aby sme ti ju mohli dodatočne pridať"
          />
        )}
        <FormSelect
          control={control}
          name="year_of_graduation"
          label="Ročník"
          options={gradeItems}
          disabled={fields.school_not}
        />
        <FormInput control={control} name="phone" label="Telefónne číslo" />
        <FormInput control={control} name="parent_phone" label="Telefónne číslo na rodiča" />
        <FormCheckbox control={control} name="gdpr" label="Súhlas so spracovaním osobných údajov" />
      </form>

      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
        Registrovať
      </Button>
    </div>
  )
}

export default RegisterForm
