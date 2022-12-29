import {Table, TableCell, TableRow} from '@mui/material'
import axios, {AxiosError} from 'axios'
import {FC, useEffect, useState} from 'react'

import {Event, Publication} from '@/types/api/competition'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Link} from '../Clickable/Clickable'

// TODO: check whether we can safely assume presence of these and either update it on BE so it gets generated that way, or update it in our `types/api/competition`
type MyPublication = Publication & {
  name: string
}
type MyEvent = Omit<Event, 'publication_set'> & {
  year: number
  school_year: string
  publication_set: MyPublication[]
}

const PublicationButton: FC<{
  publicationId: number
  publicationName: string
}> = ({publicationId, publicationName}) => {
  return <Link href={`/api/competition/publication/${publicationId}/download`}>{publicationName}</Link>
}

const ResultsButton: FC<{
  eventYear: number
  eventSeason: number
}> = ({eventYear, eventSeason}) => {
  const season = eventSeason === 0 ? 'zima' : 'leto'
  const url = `../vysledky/${eventYear}/${season}`
  return <Link href={url}>Výsledky</Link>
}

const ProblemsButton: FC<{
  eventYear: number
  eventSeason: number
}> = ({eventYear, eventSeason}) => {
  const season = eventSeason === 0 ? 'zima' : 'leto'
  const url = `../zadania/${eventYear}/${season}/1`
  return <Link href={url}>Zadania</Link>
}

export const Archive: FC = () => {
  const {seminarId} = useSeminarInfo()

  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars

  const [eventList, setEventList] = useState<MyEvent[]>([])

  // get list of events from the api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<MyEvent[]>(`/api/competition/event/?competition=${seminarId}`)
        setEventList(data)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [seminarId])

  // TODO: pridat styly pre tu tabulku
  return (
    <Table>
      {eventList.map((event) => (
        <TableRow key={event.id}>
          <TableCell>
            {event.year + '. ročník '}
            {event.season_code === 0 ? 'zimný' : 'letný'}
            {' semester '}
          </TableCell>
          <TableCell>
            <ResultsButton eventYear={event.year} eventSeason={event.season_code} />
          </TableCell>
          <TableCell>
            <ProblemsButton eventYear={event.year} eventSeason={event.season_code} />
          </TableCell>
          {event.publication_set.map((publication) => (
            <TableCell key={publication.id}>
              <PublicationButton publicationId={publication.id} publicationName={publication.name} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </Table>
  )
}
