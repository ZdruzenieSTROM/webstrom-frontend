import {FC} from 'react'
import {FileField, ImageField, NumberField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SolutionShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="problem" reference="competition/problem" link="show" />
      <ReferenceField source="semester_registration" reference="/competition/event-registration/" link="show" />
      <FileField source="solution" title="Riešenie" />
    </SimpleShowLayout>
  </MyShow>
)
