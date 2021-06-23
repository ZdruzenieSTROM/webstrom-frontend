import React, {FC} from 'react'
import {ArrayField, Datagrid, DateField, List, ListProps, TextField} from 'react-admin'

// TODO: premysliet a prerobit rozhranie, mozno ako u postov - pri kliku na riadok ukazat Show, kde budu priklady
// (nie ako teraz v zanorenom Datagride)
export const CompetitionList: FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <DateField source="deadline" />
      <TextField source="order" />
      <ArrayField source="problems">
        <Datagrid>
          <TextField source="id" />
          <TextField source="text" />
        </Datagrid>
      </ArrayField>
    </Datagrid>
  </List>
)
