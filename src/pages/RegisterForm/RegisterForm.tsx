import './RegisterForm.css'

import {yupResolver} from '@hookform/resolvers/yup'
import {Button} from '@material-ui/core'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'

import FormCheckbox from '../../components/FormItems/FormCheckbox/FromCheckbox'
import FormInput from '../../components/FormItems/FormInput/FormInput'
import {FormSelect, SelectOption} from '../../components/FormItems/FormSelect/FormSelect'

const defaultValues: {
  email: string
  password1: string
  password2: string
  school_not: boolean
  county: number | ''
  district: number | ''
  school: number | ''
  school_not_found: boolean
  year_of_graduation: number | ''
  gdpr: boolean
} = {
  email: '',
  password1: '',
  password2: '',
  school_not: false,
  county: '',
  district: '',
  school: '',
  school_not_found: false,
  year_of_graduation: '',
  gdpr: false,
}

const schema = yup.object().shape({
  email: yup.string().required(),
  password1: yup.string().required(),
  password2: yup.string().required(),
  // age: yup.number().positive().integer().required(),
})

const RegisterForm: React.FC = () => {
  const {handleSubmit, control, watch, setValue, errors} = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const fields = watch(Object.keys(defaultValues))

  const [schoolsItems, setSchoolItems] = useState<SelectOption[]>([])
  const [districtItems, setDistrictItems] = useState<SelectOption[]>([])
  const [countyItems, setCountyItems] = useState<SelectOption[]>([])

  const [emptyDistrictItems, setEmptyDistrictItems] = useState<SelectOption[]>([])
  const [emptySchoolItems, setEmptySchoolItems] = useState<SelectOption[]>([])

  const grades = [
    {
      pk: 0,
      fields: {
        name: 'Prvý ročník ZŠ',
      },
    },
    {
      pk: 1,
      fields: {
        name: 'Druhý ročník ZŠ',
      },
    },
    {
      pk: 2,
      fields: {
        name: 'Tretí ročník ZŠ',
      },
    },
    {
      pk: 3,
      fields: {
        name: 'Štvrtý ročník ZŠ',
      },
    },
    {
      pk: 4,
      fields: {
        name: 'Piaty ročník ZŠ',
      },
    },
    {
      pk: 5,
      fields: {
        name: 'Šiesty ročník ZŠ | Príma',
      },
    },
    {
      pk: 6,
      fields: {
        name: 'Siedmy ročník ZŠ | Sekunda',
      },
    },
    {
      pk: 7,
      fields: {
        name: 'Ôsmy ročník ZŠ | Tercia',
      },
    },
    {
      pk: 8,
      fields: {
        name: 'Deviaty ročník ZŠ | Kvarta | 1. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 9,
      fields: {
        name: 'Prvý ročník SŠ | Kvinta | 2. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 10,
      fields: {
        name: 'Druhý ročník SŠ | Sexta | 3. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 11,
      fields: {
        name: 'Tretí ročník SŠ | Septima | 4. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 12,
      fields: {
        name: 'Štvrtý ročník SŠ | Oktáva | 5. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 13,
      fields: {
        name: 'Už nechodím do školy',
      },
    },
  ].map((grade) => ({id: grade.pk, label: grade.fields.name}))

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

  const onSubmit = async (data: any) => {
    console.log(data)
    console.log('responseasdasda sd')
    const response = await axios.post(`http://localhost:8000/user/registration/`, data, {
      headers: {'Access-Control-Allow-Origin': '*'},
    })
    console.log('response', response)
    // console.log(errors)
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>

      <form>
        <FormInput control={control} name="email" label="Email" errors={errors.email} />
        <FormInput control={control} name="password1" label="Heslo" type="password" errors={errors.password1} />
        <FormInput
          control={control}
          name="password2"
          label="Potvrdenie hesla"
          type="password"
          errors={errors.password2}
        />
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
          disabled={fields.school_not_found || fields.school_not}
        />
        <FormSelect
          control={control}
          name="school"
          label="Škola"
          options={schoolsItems}
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
        <FormSelect
          control={control}
          name="year_of_graduation"
          label="Ročník"
          options={grades}
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
