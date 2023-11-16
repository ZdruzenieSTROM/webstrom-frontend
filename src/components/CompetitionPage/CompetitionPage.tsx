import {useRouter} from 'next/router'
import {FC, Fragment} from 'react'

import {Link} from '@/components/Clickable/Clickable'
import {Competition, Event} from '@/types/api/competition'
import {BannerContainer} from '@/utils/BannerContainer'
import {formatDate} from '@/utils/formatDate'

import styles from './competition.module.scss'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
}

export const CompetitionPage: FC<CompetitionPageProps> = ({
  competition: {name, who_can_participate, description, upcoming_or_current_event, competition_type, history_events},
}) => {
  const {setBannerText} = BannerContainer.useContainer()

  const startDate = upcoming_or_current_event ? formatDate(upcoming_or_current_event.start) : null
  const endDate = upcoming_or_current_event ? formatDate(upcoming_or_current_event.end) : null
  setBannerText(startDate ? `${name} sa bude konať  ${startDate}` : '')

  const router = useRouter()
  const rulesLink = `${router.asPath}/pravidla`

  return (
    <>
      <div className={styles.mainText}>
        {who_can_participate && <p>Pre koho? {who_can_participate}</p>}
        <p>{description}</p>
      </div>
      <div className={styles.mainText}>
        {upcoming_or_current_event ? (
          <div className={styles.mainText}>
            <p>
              <b>Nadchádzajúci ročník:</b>
            </p>
            {startDate && <p>Odkedy? {startDate} </p>}
            {endDate && <p>Dokedy? {endDate}</p>}
            {upcoming_or_current_event.publication_set.length > 0 && (
              <p>
                <Link href={`/api/${upcoming_or_current_event.publication_set[0].file}`}>Pozvánka</Link>
              </p>
            )}
            {upcoming_or_current_event.registration_link && (
              <div>
                <p>
                  Registrácia prebieha do:
                  {upcoming_or_current_event.registration_link.end}
                  <Link href={upcoming_or_current_event.registration_link.url}>Registračný formulár</Link>
                </p>

                <p>{upcoming_or_current_event.registration_link.additional_info}</p>
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
            <Link href={rulesLink}>Pravidlá</Link>
          </div>
        </div>
      </div>

      <div className={styles.h2}>
        <h2>Archív: </h2>
      </div>
      {/* TODO: asi zjednotit styly, neriesit with/without publications */}
      {competition_type?.name === 'Tábor' ? (
        <div className={styles.archiveWithoutPublications}>
          {history_events.map((event) => (
            <Fragment key={event.id}>
              <div>
                {name + ' '} {event.school_year}
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <div className={styles.archiveWithPublications}>
          {history_events.map((event) => (
            <Fragment key={event.id}>
              <div>
                {name} {event.school_year}
              </div>
              {event.publication_set.map((publication) => (
                <Link key={publication.id} href={`/api/${publication.file}`}>
                  {publication.name}
                </Link>
              ))}
            </Fragment>
          ))}
        </div>
      )}
    </>
  )
}
