import { FilterSidebar } from '@/components/Admin/custom/list-filtering/FilterSidebar'
import { GradeFilterSection } from '@/components/Admin/custom/list-filtering/GradeFilterSection'
import {FC} from 'react'
import {Datagrid, List, ReferenceField, TextField} from 'react-admin'

export const ProfileList: FC = () => (
  <List aside={<ProfileListFilters />}>
    <Datagrid>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <TextField source="school.verbose_name" />
      <ReferenceField source="grade" reference="competition/grade">
        <TextField source="tag" />
      </ReferenceField>
    </Datagrid>
  </List>
)

const ProfileListFilters: FC = () => <FilterSidebar />