import {FC} from 'react'
import {EditButton, ListButton, ShowActionsProps, TopToolbar} from 'react-admin'
// eslint-disable-next-line node/no-extraneous-import
import {useLocation} from 'react-router-dom'

export const MyShowActions: FC<ShowActionsProps> = ({basePath, data}) => {
  const {pathname} = useLocation() // bud '/cms/post/123/show' alebo '/cms/post/123/show/1' (prvy tab)

  if (!data) return null
  const currentPathWithoutTab = `${basePath}/${data.id}/show` // '/cms/post/123/show'

  let to = `${basePath}/${data.id}` // '/cms/post/123'
  const tabPart = pathname.slice(currentPathWithoutTab.length) // bud '' alebo '/1'
  if (tabPart) to = `${to}${tabPart}` // '/cms/post/123' alebo '/cms/post/123/1'

  return (
    <TopToolbar>
      <EditButton basePath={basePath} record={data} to={to} />
      <ListButton basePath={basePath} record={data} />
    </TopToolbar>
  )
}
