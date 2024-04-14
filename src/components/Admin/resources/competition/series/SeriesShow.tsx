import {FC} from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  DateField,
  ReferenceField,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SeriesShow: FC = () => (
  <MyShow>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <ReferenceField source="semester" reference="competition/semester" link="show" />
          <DateField source="deadline" />
          <TextField source="order" />
          <BooleanField source="complete" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="problems">
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
