import {FC} from 'react'
import {FunctionField, FunctionFieldProps, useTranslate} from 'react-admin'

import {seasonCodeStrings} from '../seasonCodeStrings'

export const SeasonCodeField: FC<Omit<FunctionFieldProps, 'render'>> = ({source, ...rest}) => {
  const translate = useTranslate()

  return (
    <FunctionField
      source={source}
      render={(record) => {
        return translate(seasonCodeStrings[record.season_code]?.name ?? '')
      }}
      {...rest}
    />
  )
}
