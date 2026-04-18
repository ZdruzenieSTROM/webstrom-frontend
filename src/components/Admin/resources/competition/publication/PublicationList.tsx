import {FC} from 'react'
import {Datagrid, List, ReferenceField, TextField} from 'react-admin'

import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'
import {EventFilterSection} from '@/components/Admin/custom/list-filtering/EventFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {PublicationTypeFilterSection} from '@/components/Admin/custom/list-filtering/PublicationTypeFilterSection'

export const PublicationList: FC = () => (
  <List aside={<PublicationFilters />}>
    <Datagrid>
      <TextField source="name" />
      <ReferenceField source="event" reference="competition/event" link="show" />
      <ReferenceField source="publication_type" reference="competition/publication-type" />
      <MyShowFileField source="file" />
    </Datagrid>
  </List>
)

const PublicationFilters: FC = () => (
  <FilterSidebar>
    <EventFilterSection />
    <PublicationTypeFilterSection />
  </FilterSidebar>
)
