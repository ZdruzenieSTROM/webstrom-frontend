import {FC} from 'react'
import {NumberInput, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const CompetitionEdit: FC = () => (
  <MyEdit>
    <MySimpleForm>
      <TextInput source="name" disabled />
      <TextInput source="slug" disabled />
      <NumberInput source="start_year" disabled />
      <TextInput source="description" multiline />
      <TextInput source="long_description" multiline />
      <TextInput source="rules" multiline />
      <TextInput source="competition_type.name" label="content.labels.competition_type" disabled />
      <SitesCheckboxInput source="sites" disabled />
      <TextInput source="who_can_participate" />
      <NumberInput source="min_years_until_graduation" disabled />
    </MySimpleForm>
  </MyEdit>
)
