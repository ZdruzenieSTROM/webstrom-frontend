import {FC} from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  EditButton,
  ReferenceField,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
  useCreatePath,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SeriesShow: FC = () => {
  const createPath = useCreatePath()

  return (
    <MyShow>
      <TabbedShowLayout>
        <Tab label="content.labels.general">
          <SimpleShowLayout>
            <ReferenceField source="semester" reference="competition/semester" link="show" />
            <DateTimeField source="deadline" />
            <TextField source="order" />
            <BooleanField source="complete" />
          </SimpleShowLayout>
        </Tab>
        <Tab label="content.labels.problems">
          <SimpleShowLayout>
            <ArrayField source="problems">
              <Datagrid rowClick={(id) => createPath({resource: 'competition/problem', type: 'show', id: id})}>
                <TruncatedTextField source="text" maxTextWidth={100} expandable />
                <EditButton resource="competition/problem" />
              </Datagrid>
            </ArrayField>
          </SimpleShowLayout>
        </Tab>
      </TabbedShowLayout>
    </MyShow>
  )
}
