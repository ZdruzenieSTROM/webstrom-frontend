import {FC} from 'react'
import {FunctionField, FunctionFieldProps} from 'react-admin'

import {seasonCodeStrings} from '../seasonCodeStrings'

export const SeasonCodeField: FC<Omit<FunctionFieldProps, 'render'>> = ({source, ...rest}) => {
  return (
    <FunctionField
      source={source}
      render={(record) => {
        return `${seasonCodeStrings[record.season_code].name ?? ''}`
      }}
      {...rest}
    />
  )
}
