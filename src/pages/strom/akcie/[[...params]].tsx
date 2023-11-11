import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'
import {useRouter} from 'next/router'
import {FC, Fragment} from 'react'

import {Link} from '@/components/Clickable/Clickable'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Markdown} from '@/components/StaticSites/Markdown'
import {Competition, Event} from '@/types/api/generated/competition'
import {Seminar} from '@/utils/useSeminarInfo'

import styles from './competition.module.scss'

// skusime to opravit v API - `history_events` je nespravne vygenerovane ako `any`
type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
  is_rules: boolean
}

const StaticPage: NextPage<CompetitionPageProps> = ({competition, is_rules}) => (
  <PageLayout title={competition.name}>
    {is_rules ? (
      <div className={styles.mainText}>{competition.rules && <Markdown content={competition.rules} />}</div>
    ) : (
      <>
        <div className={styles.mainText}>
          {competition.who_can_participate && <p>Pre koho? {competition.who_can_participate}</p>}
          <p>{competition.description}</p>
        </div>
        <div className={styles.mainText}>
          {competition.upcoming_or_current_event ? (
            <div className={styles.mainText}>
              <p>
                <b>Nadchádzajúci ročník:</b>
              </p>
              {competition.upcoming_or_current_event.start && (
                <p>Odkedy? {competition.upcoming_or_current_event.start} </p>
              )}
              {competition.upcoming_or_current_event.end && <p>Dokedy? {competition.upcoming_or_current_event.end}</p>}
              {competition.upcoming_or_current_event.publication_set.length > 0 && (
                <p>
                  <Link
                    href={`/api/competition/publication/${competition.upcoming_or_current_event.publication_set[0].id}/download/`}
                  >
                    Pozvánka
                  </Link>
                </p>
              )}
              {competition.upcoming_or_current_event.registration_link && (
                <div>
                  <p>
                    Registrácia prebieha do:
                    {competition.upcoming_or_current_event.registration_link.end}
                    <Link href={competition.upcoming_or_current_event.registration_link.url}>Registračný formulár</Link>
                  </p>

                  <p>{competition.upcoming_or_current_event.registration_link.additional_info}</p>
                </div>
              )}
            </div>
          ) : (
            <p>
              <b>Nadchádzajúci ročník:</b> Pripravujeme
            </p>
          )}
        </div>

        <div className={styles.container}>
          <div className={styles.actions}>
            <div className={styles.actionButton}>
              <RulesLink />
            </div>
          </div>
        </div>

        <div className={styles.h2}>
          <h2>Archív: </h2>
        </div>
        {competition.competition_type.name === 'Tábor' ? (
          <div className={styles.archive_without_publications}>
            {competition.history_events.map((event) => (
              <Fragment key={event.id}>
                <div>
                  {competition.name + ' '} {event.school_year}
                </div>
              </Fragment>
            ))}
          </div>
        ) : (
          <div className={styles.archive_with_publications}>
            {competition.history_events.map((event) => (
              <Fragment key={event.id}>
                <div>
                  {competition.name} {event.school_year}
                </div>
                {event.publication_set.map((publication) => (
                  <Link key={publication.id} href={`/api/competition/publication/${publication.id}/download/`}>
                    {publication.name}
                  </Link>
                ))}
              </Fragment>
            ))}
          </div>
        )}
      </>
    )}
  </PageLayout>
)

export default StaticPage

// wrapper aby sme to lahko vyuzili pre ostatne seminare a neduplikovali kod
export const competitionBasedGetServerSideProps =
  (seminar: Seminar): GetServerSideProps<CompetitionPageProps> =>
  async ({query}) => {
    const redirectToSeminar = {redirect: {destination: `/${seminar}`, permanent: false}}

    // `params` vychadza z nazvu suboru `[[...params]]`
    // tento check je hlavne pre typescript - parameter `params` by vzdy mal existovat a mal by byt typu string[]
    if (query?.params && Array.isArray(query.params) && query.params.length > 0) {
      const requestedUrl = query.params[0]

      try {
        const {data} = await axios.get<OurCompetition | undefined>(
          `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/competition/competition/${requestedUrl}`,
        )
        if (!data) return redirectToSeminar

        if (query.params.length === 2 && query.params[1] === 'pravidla') {
          if (!data.rules) {
            return {redirect: {destination: `/${seminar}/akcie/${requestedUrl}`, permanent: false}}
          }
          return {props: {competition: data, is_rules: true}}
        }

        return {props: {competition: data, is_rules: false}}
      } catch (e: unknown) {
        return redirectToSeminar
      }
    }

    return redirectToSeminar
  }

export const getServerSideProps = competitionBasedGetServerSideProps('strom')

const RulesLink: FC = () => {
  const router = useRouter()
  const active = `${router.asPath}/pravidla`
  return <Link href={active}>Pravidlá</Link>
}
