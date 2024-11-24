import {FC} from 'react'
import {BooleanField, FileField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const SolutionShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="problem" reference="competition/problem" link="show" />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link="show" />
      <FileField source="solution" title="Riešenie" />
      <ReferenceField source="late_tag" reference="competition/late-tag" label="content.labels.is_late" link="show" />
      <BooleanField source="is_online" label="content.labels.is_online" />
    </SimpleShowLayout>
  </MyShow>
)
