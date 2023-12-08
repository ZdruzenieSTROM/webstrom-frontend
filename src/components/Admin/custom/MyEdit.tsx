import {FC, PropsWithChildren} from 'react'
import {Edit} from 'react-admin'

import {MyEditActions} from './MyEditActions'

export const MyEdit: FC<PropsWithChildren> = ({children}) => (
  <Edit actions={<MyEditActions />} mutationMode="pessimistic" redirect="show">
    {children}
  </Edit>
)
