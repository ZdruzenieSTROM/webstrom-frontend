import {FC} from 'react'
import {ListButton, ShowButton, TopToolbar, useCreatePath, useRecordContext, useResourceContext} from 'react-admin'
import {useLocation} from 'react-router-dom'

export const MyEditActions: FC = () => {
  const {pathname} = useLocation() // bud '/cms/post/123' alebo '/cms/post/123/1' (prvy tab)

  const resource = useResourceContext()
  const record = useRecordContext()
  const createPath = useCreatePath()

  // needed, undefined on first load
  if (!record) return null

  const currentPathWithoutTab = createPath({type: 'edit', resource, id: record.id}) // '/cms/post/123'
  const tabPart = pathname.slice(currentPathWithoutTab.length) // bud '' alebo '/1'
  const path = createPath({type: 'show', resource, id: record.id}) // '/cms/post/123/show'
  const to = `${path}${tabPart}` // '/cms/post/123/show' alebo '/cms/post/123/show/1'

  return (
    <TopToolbar>
      {/* TODO - UPDATE!: find better way - new RA version also memoizes ShowButton, and it doesn't take the `to` prop
          as the args for that, meaning it doesn't rerender it when `to` changes */}
      {/* @ts-expect-error - the `to` prop is omitted from ShowButtonProps, but it's still being spread to underlying button. we want to link to the specific show tab, not just resource show */}
      <ShowButton to={to} />
      <ListButton label="content.labels.back_to_list" />
    </TopToolbar>
  )
}
