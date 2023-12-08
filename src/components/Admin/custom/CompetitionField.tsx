import {ComponentProps, FC} from 'react'
import {SelectField, useGetList} from 'react-admin'

export const CompetitionField: FC<ComponentProps<typeof SelectField>> = (props) => {
  const {data, isLoading, error} = useGetList('competition/competition')

  const typedData = data as {id: number; name: string}[]

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error occured loading competitions: {error.message}</span>

  return <SelectField choices={typedData} {...props} />
}
