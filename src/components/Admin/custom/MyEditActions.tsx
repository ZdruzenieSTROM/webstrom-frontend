import {FC} from 'react'
import {ListButton, ShowButton, TopToolbar, useCreatePath, useRecordContext, useResourceContext} from 'react-admin'
import {useLocation} from 'react-router-dom'

type MyEditActionsProps = {
  // number of tabs on the resource's show page, when the edit form has tabs that the show page doesn't
  showTabs?: number
}

export const MyEditActions: FC<MyEditActionsProps> = ({showTabs}) => {
  const {pathname} = useLocation() // bud '/cms/post/123' alebo '/cms/post/123/1' (prvy tab)

  const resource = useResourceContext()
  const record = useRecordContext()
  const createPath = useCreatePath()

  // needed, undefined on first load
  if (!record) return null

  const currentPathWithoutTab = createPath({type: 'edit', resource, id: record.id}) // '/cms/post/123'
  const editTabPart = pathname.slice(currentPathWithoutTab.length) // bud '' alebo '/1'
  // an edit-only tab (e.g. post preview) has no show counterpart: link to the first show tab instead
  const tabPart = showTabs !== undefined && Number(editTabPart.slice(1)) >= showTabs ? '' : editTabPart
  const path = createPath({type: 'show', resource, id: record.id}) // '/cms/post/123/show'
  const to = `${path}${tabPart}` // '/cms/post/123/show' alebo '/cms/post/123/show/1'

  return (
    <TopToolbar>
      {/* `to` isn't a supported ShowButton prop: it works because rest props are spread after ShowButton's own `to`.
          The `key` remounts the button on tab change, because ShowButton's memo ignores `to`. */}
      <ShowButton key={to} to={to} />
      <ListButton label="content.labels.back_to_list" />
    </TopToolbar>
  )
}
