import {FC} from 'react'
import {EditButton, ListButton, TopToolbar, useRecordContext, useResourceContext} from 'react-admin'
// eslint-disable-next-line node/no-extraneous-import
import {useLocation} from 'react-router-dom'

export const MyShowActions: FC = () => {
  const {pathname} = useLocation() // bud '/cms/post/123/show' alebo '/cms/post/123/show/1' (prvy tab)

  const resource = useResourceContext()
  const record = useRecordContext()
  // needed, undefined on first load
  if (!record) return null

  const currentPathWithoutTab = `/${resource}/${record.id}/show` // '/cms/post/123/show'
  let to = `/${resource}/${record.id}` // '/cms/post/123'
  const tabPart = pathname.slice(currentPathWithoutTab.length) // bud '' alebo '/1'
  if (tabPart) to = `${to}${tabPart}` // '/cms/post/123' alebo '/cms/post/123/1'

  return (
    <TopToolbar>
      <EditButton to={to} />
      <ListButton label="Back to list" />
    </TopToolbar>
  )
}
