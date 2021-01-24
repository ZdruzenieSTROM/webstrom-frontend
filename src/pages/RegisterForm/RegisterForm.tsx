import './RegisterForm.css'

import {Button} from '@material-ui/core'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'

import FormCheckbox from '../../components/FormItems/FormCheckbox/FromCheckbox'
import FormInput from '../../components/FormItems/FormInput/FormInput'
import {FormSelect, SelectOption} from '../../components/FormItems/FormSelect/FormSelect'

const defaultValues = {
  school_not: false,
  county: '',
  district: '',
  school_name: '',
  school: '',
  school_not_found: false,
  year_of_graduation: '',
  gdpr: false,
}

const RegisterForm: React.FC = () => {
  const {handleSubmit, control, watch} = useForm({defaultValues})
  const fields = watch(Object.keys(defaultValues))
  const [gradeItems, setGradeItems] = useState<SelectOption[]>([])
  const [schoolItems, setSchoolItems] = useState<SelectOption[]>([])
  const [districtItems, setDistrictItems] = useState<SelectOption[]>([])
  const [countyItems, setCountyItems] = useState<SelectOption[]>([])

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchData = async () => {
      const grades = await axios.get(`/api/personal/counties/`)
      setGradeItems(grades.data.map((county: any) => ({id: county.code, label: county.name})))
    }
    fetchData()
  }, [])

  // načítanie škôl z BE, ktorými vyplníme FormSelect s ročníkmi
  useEffect(() => {
    const fetchCounties = async () => {
      const counties = await axios.get(`/api/personal/counties/`)
      setCountyItems(counties.data.map((counties: any) => ({id: counties.code, label: counties.name})))
    }
    fetchCounties()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const counties = fields.county ? await axios.get(`/api/personal/districts/?county=${fields.county}`) : null
      counties && setDistrictItems(counties.data.map((school: any) => ({id: school.code, label: school.name})))
    }
    fetchData()
  }, [fields.county])

  useEffect(() => {
    const fetchData = async () => {
      const schools = fields.district ? await axios.get(`/api/personal/schools/?district=${fields.district}`) : null
      schools &&
        setSchoolItems(
          schools.data.map((school: any) => ({
            id: school.code,
            label: `${school.name} ${school.street}, ${school.city}`,
          })),
        )
    }
    fetchData()
  }, [fields.district])

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
          disabled={fields.school_not_found || fields.school_not}
        />
        <FormSelect
          control={control}
          name="school"
          label="Škola"
          options={schoolItems}
          disabled={fields.school_not_found || fields.school_not}
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
        <FormInput
          control={control}
          name="school_info"
          label="povedz nám, kam chodíš na školu, aby sme ti ju mohli dodatočne pridať"
        />
        <FormSelect control={control} name="year_of_graduation" label="Ročník" options={gradeItems} required />
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
