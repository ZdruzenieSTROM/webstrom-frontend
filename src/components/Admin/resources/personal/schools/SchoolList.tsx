import {FC} from 'react'
import {Datagrid, List, TextField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'
import { FilterSidebar } from '@/components/Admin/custom/list-filtering/FilterSidebar'

export const SchoolList: FC = () => (
  <List aside={<SchoolListFilters />}>
    <Datagrid>
      <TruncatedTextField source="name" maxTextWidth={60} />
      <TextField source="street" />
      <TextField source="city" />
      <TextField source="abbreviation" />
    </Datagrid>
  </List>
)

const SchoolListFilters: FC = () => <FilterSidebar />