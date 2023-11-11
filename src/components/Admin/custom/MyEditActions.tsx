import {FC} from 'react'
import {EditActionsProps, ListButton, ShowButton, TopToolbar, useRecordContext, useResourceContext} from 'react-admin'
// eslint-disable-next-line node/no-extraneous-import
import {useLocation} from 'react-router-dom'

export const MyEditActions: FC<EditActionsProps> = () => {
  const {pathname} = useLocation() // bud '/cms/post/123' alebo '/cms/post/123/1' (prvy tab)

  const resource = useResourceContext()
  const record = useRecordContext()
  // needed, undefined on first load
  if (!record) return null

  const currentPathWithoutTab = `/${resource}/${record.id}` // '/cms/post/123'
  let to = `${currentPathWithoutTab}/show` // '/cms/post/123/show'
  const tabPart = pathname.slice(currentPathWithoutTab.length) // bud '' alebo '/1'
  if (tabPart) to = `${to}${tabPart}` // '/cms/post/123/show' alebo '/cms/post/123/show/1'

  return (
    <TopToolbar>
      <ShowButton to={to} />
      <ListButton label="Back to list" />
    </TopToolbar>
  )
}
