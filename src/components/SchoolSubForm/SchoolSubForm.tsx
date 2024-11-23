import {Stack} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRef} from 'react'
import {Control, UseFormSetValue, UseFormWatch} from 'react-hook-form'
import {useUpdateEffect} from 'usehooks-ts'

import {IGrade} from '@/types/api/competition'
import {ISchool} from '@/types/api/personal'

import {FormAutocomplete} from '../FormItems/FormAutocomplete/FormAutocomplete'
import {FormCheckbox} from '../FormItems/FormCheckbox/FormCheckbox'
import {FormInput} from '../FormItems/FormInput/FormInput'
import {SelectOption} from '../FormItems/FormSelect/FormSelect'

export type SchoolSubFormValues = {
  new_school_description?: string
  without_school: boolean
  school?: SelectOption | null
  school_not_found: boolean
  grade: SelectOption | null
}

type SchoolSubFormProps<T extends SchoolSubFormValues> = {
  control: Control<T, unknown>
  watch: UseFormWatch<T>
  setValue: UseFormSetValue<T>
  gap: number
}

export const SchoolSubForm = ({control, watch, setValue, gap}: SchoolSubFormProps<SchoolSubFormValues>) => {
  const [school_not_found, without_school] = watch(['school_not_found', 'without_school'])

  const otherSchoolItem = useRef<SelectOption>(undefined)
  const withoutSchoolItem = useRef<SelectOption>(undefined)
  const noGradeItem = useRef<SelectOption>(undefined)

  // načítanie ročníkov z BE, ktorými vyplníme FormSelect s ročníkmi
  const {data: gradesData} = useQuery({
    queryKey: ['competition', 'grade'],
    queryFn: () => axios.get<IGrade[]>(`/api/competition/grade`),
  })
  const grades = gradesData?.data ?? []
  const gradeItems: SelectOption[] = grades.map(({id, name}) => ({id, label: name}))

  // načítanie škôl z BE, ktorými vyplníme FormAutocomplete so školami
  const {data: schoolsData} = useQuery({
    queryKey: ['personal', 'schools'],
    queryFn: () => axios.get<ISchool[]>(`/api/personal/schools`),
  })
  const schools = schoolsData?.data ?? []
  const allSchoolItems: SelectOption[] = schools.map(({code, city, name, street}) => ({
    id: code,
    label: city ? `${name} ${street}, ${city}` : name,
  }))
  const emptySchoolItems = allSchoolItems.filter(({id}) => [0, 1].includes(id))
  otherSchoolItem.current = emptySchoolItems.find(({id}) => id === 0)
  withoutSchoolItem.current = emptySchoolItems.find(({id}) => id === 1)
  const schoolItems = allSchoolItems.filter(({id}) => ![0, 1].includes(id))
  noGradeItem.current = gradeItems.find(({id}) => id === 13)

  // predvyplnenie/zmazania hodnôt pri zakliknutí checkboxu pre užívateľa po škole
  useUpdateEffect(() => {
    if (without_school) {
      setValue('school', withoutSchoolItem.current)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setValue('grade', noGradeItem.current!)
      setValue('school_not_found', false)
    } else {
      setValue('school', null)
      setValue('grade', null)
    }
  }, [without_school])

  // predvyplnenie/zmazania hodnôt pri zakliknutí checkboxu pre neznámu školu
  useUpdateEffect(() => {
    if (school_not_found) {
      setValue('school', otherSchoolItem.current)
    } else if (!without_school) {
      setValue('school', null)
    }
  }, [school_not_found])

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}
  return (
    <Stack gap={gap}>
      <FormCheckbox control={control} name="without_school" label="nie som študent základnej ani strednej školy" />
      <FormAutocomplete
        control={control}
        name="school"
        label="škola*"
        options={school_not_found || without_school ? emptySchoolItems : schoolItems}
        disabled={!schoolItems.length || school_not_found || without_school}
        rules={requiredRule}
      />
      <FormCheckbox
        control={control}
        name="school_not_found"
        label="moja škola sa v zozname nenachádza"
        disabled={without_school}
      />
      {school_not_found && (
        <FormInput
          control={control}
          name="new_school_description"
          label="názov školy*"
          rules={school_not_found ? requiredRule : {}}
          sx={{mb: '1rem'}}
        />
      )}
      <FormAutocomplete
        control={control}
        name="grade"
        label="ročník*"
        options={gradeItems.filter(({id}) => id !== 13 || without_school)}
        disabled={!gradeItems.length || without_school}
        rules={requiredRule}
      />
    </Stack>
  )
}
