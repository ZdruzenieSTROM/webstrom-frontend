import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, useGetOne} from 'react-admin'
import {useFormContext} from 'react-hook-form'

export const ProblemReferenceInput: FC = () => {
  const {watch} = useFormContext()
  const semesterRegistration = watch('semester_registration')
  const eventRegistration = useGetOne('competition/event-registration', {id: semesterRegistration})
  const semester = eventRegistration.data?.event

  return (
    <ReferenceInput source="problem" reference="competition/problem" filter={semester ? {semester} : undefined}>
      <AutocompleteInput
        validate={required()}
        helperText={
          semester ? 'Filtrované podľa semestra riešiteľa. Zmaž pole Riešiteľ pre vyhľadávanie vo všetkých.' : undefined
        }
      />
    </ReferenceInput>
  )
}
