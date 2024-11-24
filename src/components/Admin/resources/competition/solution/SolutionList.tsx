import {FC} from 'react'
import {BooleanField, Datagrid, FunctionField, List, RaRecord, ReferenceField} from 'react-admin'

export const SolutionList: FC = () => (
  <List>
    <Datagrid>
      <ReferenceField source="problem" reference="competition/problem" link={false} />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link={false} />
      <FunctionField<RaRecord>
        label="Má nahraté riešenie"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution']}} source="xxx" />}
      />
      <ReferenceField source="late_tag" reference="competition/late-tag" label="Po termíne" link={false} />
      <BooleanField source="is_online" label="Internetové riešenie" />
    </Datagrid>
  </List>
)
