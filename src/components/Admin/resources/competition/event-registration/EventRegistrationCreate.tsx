import {FC} from 'react'
import {AutocompleteInput, RaRecord, ReferenceInput, required, SimpleForm} from 'react-admin'
import {useFormContext} from 'react-hook-form'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyToolbar} from '@/components/Admin/custom/MyToolbar'

const ProfileInput = () => {
  const {setValue} = useFormContext()
  const prefill = (_: number, profile: RaRecord | string) => {
    if (typeof profile === 'string') return
    setValue('school', profile.school.code)
    setValue('grade', profile.grade)
  }

  return (
    <ReferenceInput source="profile" reference="personal/profiles">
      <AutocompleteInput optionText="verbose_name" validate={required()} onChange={prefill} />
    </ReferenceInput>
  )
}

export const EventRegistrationCreate: FC = () => {
  return (
    <MyCreate>
      <SimpleForm toolbar={<MyToolbar />}>
        <ProfileInput />
        <ReferenceInput source="school" reference="personal/schools">
          <AutocompleteInput optionText="verbose_name" validate={required()} />
        </ReferenceInput>
        <ReferenceInput source="grade" reference="competition/grade">
          <AutocompleteInput optionText="name" validate={required()} />
        </ReferenceInput>
        <EventReferenceInput />
      </SimpleForm>
    </MyCreate>
  )
}

const EventReferenceInput = () => {
  const {watch} = useFormContext()
  const grade = watch('grade')

  return (
    <ReferenceInput source="event" reference="competition/event" filter={{grade, future: true}}>
      <AutocompleteInput optionText="verbose_name" validate={required()} />
    </ReferenceInput>
  )
}
