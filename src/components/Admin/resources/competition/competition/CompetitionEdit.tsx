import {FC} from 'react'
import {NumberInput, SimpleForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const CompetitionEdit: FC = () => (
  <MyEdit>
    <SimpleForm>
      <TextInput source="name" fullWidth disabled />
      <TextInput source="slug" fullWidth disabled />
      <NumberInput source="start_year" fullWidth disabled />
      <TextInput source="description" multiline fullWidth />
      <TextInput source="rules" multiline fullWidth />
      <TextInput source="competition_type.name" label="content.labels.competition_type" fullWidth disabled />
      <SitesCheckboxInput source="sites" disabled />
      <TextInput source="who_can_participate" fullWidth />
      <NumberInput source="min_years_until_graduation" fullWidth disabled />
    </SimpleForm>
  </MyEdit>
)
