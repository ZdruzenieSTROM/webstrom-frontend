import {FC} from 'react'
import {BooleanField, FileField, FunctionField, RaRecord, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const SolutionShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="problem" reference="competition/problem" link="show" />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link="show" />
      <FileField source="solution" title="Riešenie" />
      <FunctionField<RaRecord>
        source="late_tag"
        render={(record) => record && <span>{record['late_tag'].name}</span>}
      />
      <BooleanField source="is_online" label="content.labels.is_online" />
    </SimpleShowLayout>
  </MyShow>
)
