import {FC} from 'react'
import {BooleanField, Datagrid, FunctionField, List, RaRecord, ReferenceField} from 'react-admin'

export const SolutionList: FC = () => (
  <List>
    <Datagrid>
      <ReferenceField source="problem" reference="competition/problem" link={false} />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link={false} />
      <FunctionField<RaRecord>
        label="content.labels.has_solution"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution']}} source="xxx" />}
      />
      <ReferenceField source="late_tag" reference="competition/late-tag" link={false} />
      <BooleanField source="is_online" />
    </Datagrid>
  </List>
)

// TODO: filtre a ordering podla https://github.com/ZdruzenieSTROM/webstrom-backend/pull/460/files#diff-148e08b739e60a78edfc1e546340f501840b75f1646afa58ee524ff82cfc061eR537-R567
