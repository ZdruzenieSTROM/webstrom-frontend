import type {FC} from 'react'
import type {RaRecord} from 'react-admin'
import {BooleanField, FunctionField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShow} from '@/components/Admin/custom/MyShow'

import {SolutionFileField} from './SolutionFileField'

export const SolutionShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="problem" reference="competition/problem" link="show" />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link="show" />
      <SolutionFileField source="solution" />
      <FunctionField<RaRecord>
        source="late_tag"
        render={(record) => record && <span>{record['late_tag']?.name}</span>}
      />
      <BooleanField source="is_online" />
      <DateTimeField source="uploaded_at" />
    </SimpleShowLayout>
  </MyShow>
)
