import {Typography} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, Fragment} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Competition, Event} from '@/types/api/competition'
import {BannerContainer} from '@/utils/BannerContainer'
import {formatDateTime} from '@/utils/formatDate'

import styles from './competition.module.scss'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
}

export const CompetitionPage: FC<CompetitionPageProps> = ({
  competition: {name, who_can_participate, description, upcoming_or_current_event, competition_type, history_events},
}) => {
  const {setBannerText} = BannerContainer.useContainer()

  const startDate = upcoming_or_current_event ? formatDateTime(upcoming_or_current_event.start) : null
  const endDate = upcoming_or_current_event ? formatDateTime(upcoming_or_current_event.end) : null
  setBannerText(startDate ? `${name} sa bude konať  ${startDate}` : '')

  const router = useRouter()
  const rulesLink = `${router.asPath}/pravidla`

  return (
    <>
      <div className={styles.mainText}>
        {who_can_participate && (
          <div className={styles.mainText}>
            <Typography variant="body1">Pre koho? {who_can_participate}</Typography>
            <Typography variant="body1">{description}</Typography>
          </div>
        )}
      </div>
      <div className={styles.mainText}>
        {upcoming_or_current_event ? (
          <div className={styles.mainText}>
            <Typography variant="body1">Nadchádzajúci ročník:</Typography>
            {startDate && <Typography variant="body1"> Odkedy? {startDate} </Typography>}
            {endDate && <Typography variant="body1"> Dokedy? {endDate} </Typography>}
            {upcoming_or_current_event.publication_set.length > 0 && (
              <Typography variant="body1">
                <Link variant="button2" href={`/api/${upcoming_or_current_event.publication_set[0].file}`}>
                  Pozvánka
                </Link>
              </Typography>
            )}
            {upcoming_or_current_event.registration_link && (
              <div className={styles.mainText}>
                <Typography variant="body1">
                  Registrácia prebieha do:
                  {upcoming_or_current_event.registration_link.end}
                </Typography>
                <Typography variant="body1">
                  <Link variant="button2" href={upcoming_or_current_event.registration_link.url}>
                    Registračný formulár
                  </Link>
                </Typography>
                <Typography variant="body1">{upcoming_or_current_event.registration_link.additional_info}</Typography>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.mainText}>
            <Typography variant="body1" fontStyle="bold">
              Nadchádzajúci ročník: Pripravujeme
            </Typography>
          </div>
        )}
      </div>

      <div className={styles.mainText}>
        <Typography variant="body1">
          <Link variant="button2" href={rulesLink}>
            Pravidlá
          </Link>
        </Typography>
      </div>

      <div>
        <Typography variant="h2">Archív: </Typography>
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
                <Link variant="button2" key={publication.id} href={`/api/${publication.file}`}>
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
