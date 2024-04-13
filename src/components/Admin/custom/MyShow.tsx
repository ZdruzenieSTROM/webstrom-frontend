import {FC, PropsWithChildren} from 'react'
import {RecordRepresentation, Show, ShowProps} from 'react-admin'

import {MyShowActions} from './MyShowActions'

export const MyShow: FC<PropsWithChildren<ShowProps>> = ({children, ...rest}) => (
  <Show actions={<MyShowActions />} title={<RecordRepresentation />} {...rest}>
    {children}
  </Show>
)
