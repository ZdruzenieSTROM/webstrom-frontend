import {FC} from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  ReferenceField,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SeriesShow: FC = () => (
  <MyShow>
    <TabbedShowLayout>
      <Tab label="content.labels.general">
        <SimpleShowLayout>
          <ReferenceField source="semester" reference="competition/semester" link="show" />
          <DateTimeField source="deadline" />
          <TextField source="order" />
          <ReferenceField source="sum-methods" reference="competition/series/sum-methods" link="show" />
          <BooleanField source="complete" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="content.labels.problems">
        <SimpleShowLayout>
          <ArrayField source="problems">
            <Datagrid>
              <TruncatedTextField source="text" maxTextWidth={100} expandable />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </MyShow>
)
