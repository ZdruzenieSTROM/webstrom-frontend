import type {FC} from 'react'
import type {RaRecord} from 'react-admin'
import {BooleanField, FunctionField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {getCorrectedSolutionUrl, getSolutionUrl} from '@/utils/getSolutionUrl'

import {SolutionFileField} from './SolutionFileField'

export const SolutionShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="problem" reference="competition/problem" link="show" />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link="show" />
      <SolutionFileField source="solution" getUrl={getSolutionUrl} />
      <SolutionFileField source="corrected_solution" getUrl={getCorrectedSolutionUrl} />
      <FunctionField<RaRecord>
        source="late_tag"
        render={(record) => record && <span>{record['late_tag']?.name}</span>}
      />
      <BooleanField source="is_online" label="content.labels.is_online" />
    </SimpleShowLayout>
  </MyShow>
)
