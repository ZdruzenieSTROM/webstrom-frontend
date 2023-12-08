import {ComponentProps, FC} from 'react'
import {SelectInput, useGetList} from 'react-admin'

export const CompetitionInput: FC<ComponentProps<typeof SelectInput>> = (props) => {
  const {data, isLoading, error} = useGetList('competition/competition')

  const typedData = data as {id: number; name: string}[]

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error occured loading competitions: {error.message}</span>

  return <SelectInput choices={typedData} {...props} />
}
