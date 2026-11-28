import {FC} from 'react'
import {NumberField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {ProblemRecordPreview} from '@/components/Admin/custom/ProblemPreview'

export const ProblemShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="series" reference="competition/series" link="show" />
      <NumberField source="order" />
      <ProblemRecordPreview label="content.labels.preview" />
      <MyShowFileField source="solution_pdf" />
      <NumberField source="num_comments" />
    </SimpleShowLayout>
  </MyShow>
)
