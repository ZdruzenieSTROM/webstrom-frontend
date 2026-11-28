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
  useRecordContext,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {ExistingProblem} from '@/components/Admin/custom/latex-import/planSeriesImport'
import {SeriesLatexImport} from '@/components/Admin/custom/latex-import/SeriesLatexImport'
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
          <SeriesProblemsImport />
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

const SeriesProblemsImport: FC = () => {
  const record = useRecordContext<{id: number; order: number; problems: ExistingProblem[]}>()
  if (!record) return null

  // react-admin keeps this page mounted when only the id changes; the key keeps a file pasted for one series
  // from being saved into the next one
  return (
    <SeriesLatexImport key={record.id} seriesId={record.id} seriesOrder={record.order} existing={record.problems} />
  )
}
