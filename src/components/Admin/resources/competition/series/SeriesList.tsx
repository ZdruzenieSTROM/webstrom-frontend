import {FC} from 'react'
import {ArrayField, Datagrid, DateField, List, TextField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

// TODO: premysliet a prerobit rozhranie, mozno ako u postov - pri kliku na riadok ukazat Show, kde budu priklady
// (nie ako teraz v zanorenom Datagride)
export const SeriesList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <DateField source="deadline" />
      <TextField source="order" />
      <ArrayField source="problems">
        <Datagrid>
          <TruncatedTextField source="text" maxTextWidth={50} />
        </Datagrid>
      </ArrayField>
    </Datagrid>
  </List>
)
