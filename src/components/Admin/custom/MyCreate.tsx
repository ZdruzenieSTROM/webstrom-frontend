import {FC, PropsWithChildren} from 'react'
import {Create, CreateProps} from 'react-admin'

export const MyCreate: FC<PropsWithChildren<CreateProps>> = ({children, ...rest}) => (
  <Create redirect="show" {...rest}>
    {children}
  </Create>
)
