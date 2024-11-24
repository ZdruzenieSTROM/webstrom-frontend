import {FC} from 'react'
import {EditButton, ListButton, TopToolbar, useCreatePath, useRecordContext, useResourceContext} from 'react-admin'
// eslint-disable-next-line node/no-extraneous-import
import {useLocation} from 'react-router-dom'

export const MyShowActions: FC = () => {
  const {pathname} = useLocation() // bud '/cms/post/123/show' alebo '/cms/post/123/show/1' (prvy tab)

  const resource = useResourceContext()
  const record = useRecordContext()
  const createPath = useCreatePath()

  // needed, undefined on first load
  if (!record) return null

  const currentPathWithoutTab = createPath({type: 'show', resource, id: record.id}) // '/cms/post/123/show'
  const tabPart = pathname.slice(currentPathWithoutTab.length) // bud '' alebo '/1'
  const path = createPath({type: 'edit', resource, id: record.id}) // '/cms/post/123'
  const to = `${path}${tabPart}` // '/cms/post/123' alebo '/cms/post/123/1'

  return (
    <TopToolbar>
      <EditButton to={to} />
      <ListButton label="Back to list" />
    </TopToolbar>
  )
}
