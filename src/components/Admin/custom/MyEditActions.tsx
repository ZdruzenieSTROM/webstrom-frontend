import {FC} from 'react'
import {ListButton, ShowButton, TopToolbar, useRecordContext, useResourceContext} from 'react-admin'
// eslint-disable-next-line node/no-extraneous-import
import {useLocation} from 'react-router-dom'

export const MyEditActions: FC = () => {
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
      {/* the `to` prop was omitted from ShowButton in recent RA version, but it's still working
            and RA doesn't provide better way to do this
          eslint-disable-next-line @typescript-eslint/ban-ts-comment
          @ts-ignore */}
      <ShowButton to={to} />
      <ListButton label="Back to list" />
    </TopToolbar>
  )
}
