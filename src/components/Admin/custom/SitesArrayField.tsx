import {FC} from 'react'
import {FieldProps} from 'react-admin'

import {seminarIdToName} from '@/utils/useSeminarInfo'

import {MyArrayField} from './MyArrayField'

const getSeminarName = (seminarId: number) => seminarIdToName[seminarId]

export const SitesArrayField: FC<FieldProps> = (props) => <MyArrayField {...props} formatNumber={getSeminarName} />
