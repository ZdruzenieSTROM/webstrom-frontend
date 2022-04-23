import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'
import {Fragment} from 'react'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Markdown} from '@/components/StaticSites/Markdown'
import {Event, UnspecifiedPublication} from '@/types/api/generated/competition'
import {Seminar} from '@/utils/useSeminarInfo'

import styles from './competition.module.scss'

type CompetitionPageProps = {
  id?: number
  event_set: Event[]
  name: string
  start_year?: number
  description?: string
  rules?: string | null
  competition_type: any
  min_years_until_graduation?: number | null
  sites: any[]
  permission_group?: any[]
}

const StaticPage: NextPage<CompetitionPageProps> = (competition: CompetitionPageProps) => (
  <PageLayout title={competition.name}>
    <div className={styles.mainText}>
      <p>{competition.description}</p>
      <p>tlacitko pre pravidla</p>
    </div>
    <div className={styles.archive}>
      {competition.event_set.map((event) => (
        <Fragment key={event.id}>
          <p>{event.year}</p>
          {event.unspecifiedpublication_set.map((publication) => (
            <Fragment key={publication.id}>
              <p> {publication.name}</p>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  </PageLayout>
)

export default StaticPage

// wrapper aby sme to lahko vyuzili pre ostatne seminare a neduplikovali kod
export const competitionBasedGetServerSideProps = (
  seminar: Seminar,
): GetServerSideProps<CompetitionPageProps> => async ({query}) => {
  // `page` vychadza z nazvu suboru `[page]`
  // tento check je hlavne pre typescript - parameter `page` by vzdy mal existovat a vzdy ako string
  if (query?.page && typeof query.page === 'string') {
    const requestedUrl = query.page
    const {data} = await axios.get<CompetitionPageProps | undefined>(
      `${process.env.NEXT_PUBLIC_BE_URL}/competition/competition/${requestedUrl}/`,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    )

    // ked stranka neexistuje, vrati sa `content: ""`. teraz renderujeme stranku len ked je content neprazdny a server rovno vrati redirect.
    // druha moznost by bola nechat prazdny content handlovat clienta - napriklad zobrazit custom error, ale nechat usera na neplatnej stranke.
    // tretia moznost je miesto redirectu vratit nextovsku 404
    if (data?.name) {
      return {
        props: data,
      }
    }
  }

  return {redirect: {destination: `/${seminar}`, permanent: false}}
}

export const getServerSideProps = competitionBasedGetServerSideProps('strom')
