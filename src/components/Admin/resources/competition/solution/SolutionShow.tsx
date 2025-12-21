import type {FC} from 'react'
import type {RaRecord} from 'react-admin'
import {BooleanField, FunctionField, NumberInput, ReferenceField, SimpleShowLayout} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {getCorrectedSolutionUrl, getSolutionUrl} from '@/utils/getSolutionUrl'

export const SolutionShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="problem" reference="competition/problem" link="show" />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link="show" />
      <MyShowFileField source="solution" reformatUrlFromId={getSolutionUrl} />
      <MyShowFileField source="corrected_solution" reformatUrlFromId={getCorrectedSolutionUrl} />
      <FunctionField<RaRecord>
        source="late_tag"
        render={(record) => record && <span>{record['late_tag']?.name}</span>}
      />
      <NumberInput source="score" />
      <BooleanField source="is_online" />
      <DateTimeField source="uploaded_at" />
    </SimpleShowLayout>
  </MyShow>
)
