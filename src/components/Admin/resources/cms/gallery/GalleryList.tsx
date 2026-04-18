import {FC} from 'react'
import {Datagrid, List, TextField} from 'react-admin'

import {CompetitionFilterSection} from '@/components/Admin/custom/list-filtering/CompetitionFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'

export const GalleryList: FC = () => (
  <List aside={<GalleryListFilters />}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="gallery_link" />
      <TextField source="event_name" />
    </Datagrid>
  </List>
)

const GalleryListFilters: FC = () => (
  <FilterSidebar>
    <CompetitionFilterSection />
  </FilterSidebar>
)
