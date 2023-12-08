import {FC} from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SeriesShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <TextField source="id" />
          <DateField source="deadline" />
          <TextField source="order" />
          <NumberField source="semester" />
          <BooleanField source="frozen_results" />
          <BooleanField source="complete" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="problems">
        <SimpleShowLayout>
          <ArrayField source="problems">
            <Datagrid>
              <TextField source="id" />
              <TruncatedTextField source="text" maxTextWidth={50} />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)
