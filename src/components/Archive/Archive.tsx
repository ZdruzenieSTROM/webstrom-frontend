import {Table, TableCell, TableRow} from '@mui/material'
import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import {FC, Fragment, useEffect, useState} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Link} from '../Clickable/Clickable'
import styles from './Archive.module.scss'

interface Publication {
  id: number
  name: string
  file: any
  event: string
}

interface Event {
  id: number
  can_participate: any
  is_registered: any
  publication_set: Publication[]
  registration_link: any
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  additional_name: string | null
  competition: string | null
}

const PublicationButton: FC<{
  publicationId: number
  publicationName: string
}> = ({publicationId, publicationName}) => {
  return (
    <span className={clsx(styles.actionButton)}>
      <Link href={`/api/competition/publication/${publicationId}/download/`}>
        <a>{publicationName + ' '}</a>
      </Link>
    </span>
  )
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

  const [eventList, setEventList] = useState<Event[]>([])

  // get list of events from the api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Event[]>(`/api/competition/event/?competition=${seminarId}`)
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
    <div>
      <h2>Archív: </h2>
      <Table>
        {eventList.map((event) => (
          <Fragment key={event.id}>
            <TableRow>
              <TableCell>
                {event.year + '. ročník '}
                {event.season_code === 0 ? 'zimný' : 'letný'}
                {' semester '}
              </TableCell>
              <TableCell>
                <ResultsButton eventYear={event.year} eventSeason={event.season_code}></ResultsButton>
              </TableCell>
              <TableCell>
                <ProblemsButton eventYear={event.year} eventSeason={event.season_code}></ProblemsButton>
              </TableCell>
              {event.publication_set.map((publication) => (
                <TableCell key={publication.id}>
                  <PublicationButton
                    publicationId={publication.id}
                    publicationName={publication.name}
                  ></PublicationButton>
                </TableCell>
              ))}
            </TableRow>
          </Fragment>
        ))}
      </Table>
    </div>
  )
}
