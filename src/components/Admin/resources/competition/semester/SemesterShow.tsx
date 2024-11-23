import {FC} from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  FunctionField,
  NumberField,
  ReferenceArrayField,
  ReferenceField,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SemesterShow: FC = () => {
  const season_code_strings = [
    {id: 0, name: 'Zimný'},
    {id: 1, name: 'Letný'},
    {id: 2, name: 'Iný'},
  ]

  return (
    <MyShow>
      <TabbedShowLayout>
        <Tab label="general">
          <SimpleShowLayout>
            <ReferenceField source="competition" reference="competition/competition" link="show" />
            <NumberField source="year" />
            <FunctionField
              source="season_code"
              render={(record) => {
                return `${season_code_strings[record.season_code].name ?? ''}`
              }}
            />
            <TextField source="school_year" />
            <DateTimeField source="start" />
            <DateTimeField source="end" />
            <BooleanField source="complete" />
            <TextField source="additional_name" />
            <NumberField source="registration_link" />
          </SimpleShowLayout>
        </Tab>
        <Tab label="series">
          <SimpleShowLayout>
            <ArrayField source="series_set">
              <Datagrid rowClick={(id) => `/competition/series/${id}/show`}>
                <DateTimeField source="deadline" />
                <TextField source="order" />
                <ArrayField source="problems">
                  <Datagrid>
                    <TruncatedTextField source="text" maxTextWidth={50} />
                  </Datagrid>
                </ArrayField>
              </Datagrid>
            </ArrayField>
          </SimpleShowLayout>
        </Tab>
        <Tab label="publications">
          <SimpleShowLayout>
            <ArrayField source="publication_set">
              <Datagrid>
                <TextField source="name" />
                <TextField source="file" />
                <ReferenceField source="publication_type" reference="competition/publication-type" link="show">
                  <TextField source="name" />
                </ReferenceField>
                <NumberField source="event" />
                <NumberField source="order" />
              </Datagrid>
            </ArrayField>
          </SimpleShowLayout>
        </Tab>
        <Tab label="late tags">
          <SimpleShowLayout>
            <ReferenceArrayField source="late_tags" reference="competition/late-tag">
              <Datagrid>
                <TextField source="name" />
                <TextField source="slug" />
                <TextField source="upper_bound" />
                <BooleanField source="can_resubmit" />
              </Datagrid>
            </ReferenceArrayField>
          </SimpleShowLayout>
        </Tab>
      </TabbedShowLayout>
    </MyShow>
  )
}
