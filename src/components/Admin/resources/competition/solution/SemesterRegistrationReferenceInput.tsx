import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required} from 'react-admin'
import {useFormContext} from 'react-hook-form'

export const SemesterRegistrationReferenceInput: FC = () => {
  const {watch} = useFormContext()
  const problem = watch('problem')

  return (
    <ReferenceInput
      source="semester_registration"
      reference="competition/event-registration"
      filter={problem ? {problem} : undefined}
    >
      <AutocompleteInput
        optionText="verbose_name"
        validate={required()}
        helperText={problem ? 'Filtrované podľa úlohy. Zmaž pole Úloha pre vyhľadávanie vo všetkých.' : undefined}
      />
    </ReferenceInput>
  )
}
