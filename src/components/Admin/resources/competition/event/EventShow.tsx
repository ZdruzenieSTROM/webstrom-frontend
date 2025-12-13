import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  EditButton,
  NumberField,
  ReferenceField,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
  useCreatePath,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {SeasonCodeField} from '@/components/Admin/custom/SeasonCodeField'

export const EventShow: FC = () => {
  const createPath = useCreatePath()

  return (
    <MyShow>
      <TabbedShowLayout>
        <Tab label="content.labels.general">
          <SimpleShowLayout>
            <ReferenceField source="competition" reference="competition/competition" link="show" />
            <NumberField source="year" />
            <SeasonCodeField source="season_code" />
            <TextField source="school_year" />
            <DateTimeField source="start" />
            <DateTimeField source="end" />
            <TextField source="location" />
            <TextField source="additional_name" />

            <TextField source="registration_link.url" />
            <DateTimeField source="registration_link.start" />
            <DateTimeField source="registration_link.end" />
            <TextField source="registration_link.additional_info" />
          </SimpleShowLayout>
        </Tab>
        <Tab label="content.labels.publications">
          <SimpleShowLayout>
            <ArrayField source="publication_set">
              <Datagrid rowClick={(id) => createPath({resource: 'competition/publication', type: 'edit', id: id})}>
                <MyShowFileField source="file" title="verbose_name" />
                <ReferenceField source="publication_type" reference="competition/publication-type">
                  <TextField source="name" />
                </ReferenceField>
                <NumberField source="order" />
                <EditButton resource="competition/publication" />
              </Datagrid>
            </ArrayField>
          </SimpleShowLayout>
        </Tab>
      </TabbedShowLayout>
    </MyShow>
  )
}
