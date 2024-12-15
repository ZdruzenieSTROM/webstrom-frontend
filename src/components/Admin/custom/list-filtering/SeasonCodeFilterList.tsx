import {FC} from 'react'
import {FilterList, FilterListItem} from 'react-admin'

import {seasonCodeStrings} from '../../seasonCodeStrings'

export const SeasonCodeFilterList: FC = () => {
  return (
    <FilterList label="season_code" icon={null}>
      {seasonCodeStrings.map((season) => (
        <FilterListItem key={season.id} label={season.name} value={{season_code: season.id}} />
      ))}
    </FilterList>
  )
}
