import {FC} from 'react'
import {Datagrid, FilterList, FilterListItem, FunctionField, List, RaRecord, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'
import {seminarIds, seminarIdToName} from '@/utils/useSeminarInfo'

export const PostList: FC = () => (
  <List aside={<PostListFilters />}>
    <Datagrid>
      <TextField source="caption" sortable={false} />
      <TruncatedTextField source="short_text" maxTextWidth={50} sortable={false} />
      <TruncatedTextField source="details" maxTextWidth={50} sortable={false} />
      <DateTimeField source="added_at" />
      <DateTimeField source="visible_after" />
      <DateTimeField source="visible_until" />
      <SitesArrayField source="sites" sortable={false} />
      <FunctionField<RaRecord>
        source="links"
        render={(record) => record && <span>{record['links']?.length}</span>}
        sortable={false}
      />
    </Datagrid>
  </List>
)

const PostListFilters: FC = () => (
  <FilterSidebar>
    <FilterList label="Seminár" icon={null}>
      {seminarIds.map((seminarId) => (
        <FilterListItem key={seminarId} label={seminarIdToName[seminarId]} value={{sites: seminarId}} />
      ))}
    </FilterList>
  </FilterSidebar>
)
