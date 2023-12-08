import {FC, PropsWithChildren} from 'react'
import {Create} from 'react-admin'

export const MyCreate: FC<PropsWithChildren> = ({children}) => <Create redirect="show">{children}</Create>
