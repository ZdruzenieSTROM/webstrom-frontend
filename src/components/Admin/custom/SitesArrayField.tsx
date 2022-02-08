import {FC} from 'react'
import {FieldProps} from 'react-admin'

import {getSeminarName} from '@/components/PageLayout/MenuMain/MenuMain'

import {MyArrayField} from './MyArrayField'

export const SitesArrayField: FC<FieldProps> = (props) => <MyArrayField {...props} formatNumber={getSeminarName} />
