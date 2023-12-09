import {FC, PropsWithChildren} from 'react'
import {Edit, EditProps} from 'react-admin'

import {MyEditActions} from './MyEditActions'

export const MyEdit: FC<PropsWithChildren<EditProps>> = ({children, ...rest}) => (
  <Edit actions={<MyEditActions />} mutationMode="pessimistic" redirect="show" {...rest}>
    {children}
  </Edit>
)
