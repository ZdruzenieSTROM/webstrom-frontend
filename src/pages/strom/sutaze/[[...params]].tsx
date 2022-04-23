import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'
import {FC, Fragment} from 'react'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Markdown} from '@/components/StaticSites/Markdown'
import {Competition, Event, UnspecifiedPublication} from '@/types/api/generated/competition'
import {Seminar} from '@/utils/useSeminarInfo'

import styles from './competition.module.scss'

type CompetitionPageProps = {
  competition: {
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
  is_rules: boolean
}

const StaticPage: NextPage<CompetitionPageProps> = ({competition, is_rules}) => (
  <PageLayout title={competition.name}>
    {is_rules ? (
      <div className={styles.mainText}>
        <p>{competition.rules}</p>
      </div>
    ) : (
      <>
        <div className={styles.mainText}>
          <p>{competition.description}</p>
        </div>
        {competition.rules && (
          <div className={styles.container}>
            <div className={styles.action}>
              <RulesButton />
            </div>
          </div>
        )}
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
      </>
    )}
  </PageLayout>
)

export default StaticPage

// wrapper aby sme to lahko vyuzili pre ostatne seminare a neduplikovali kod
export const competitionBasedGetServerSideProps = (
  seminar: Seminar,
): GetServerSideProps<CompetitionPageProps> => async ({query}) => {
  // `params` vychadza z nazvu suboru `[[...params]]`
  // tento check je hlavne pre typescript - parameter `params` by vzdy mal existovat
  let is_rules = false
  if (query?.params) {
    if (query.params?.length === 1) {
      is_rules = false
    }
    if (query.params?.length === 2 && query.params[1] === 'pravidla') {
      is_rules = true
    }
    const requestedUrl = query.params[0]
    const {data} = await axios.get<Competition | undefined>(
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
        props: {competition: data, is_rules},
      }
    }
  }

  return {redirect: {destination: `/${seminar}`, permanent: false}}
}

export const getServerSideProps = competitionBasedGetServerSideProps('strom')

const RulesButton: FC = () => {
  const handleClick = async () => {
    /* Todo presmeruje na stranku s pravidlami */
  }
  return (
    <>
      <span onClick={() => handleClick()} className={styles.actionButton}>
        Pravidlá
      </span>
    </>
  )
}
