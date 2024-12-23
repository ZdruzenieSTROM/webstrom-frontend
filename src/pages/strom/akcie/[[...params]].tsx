import {GetServerSideProps, NextPage} from 'next'

import {apiAxios} from '@/api/apiAxios'
import {CompetitionPage} from '@/components/CompetitionPage/CompetitionPage'
import {RulesPage} from '@/components/CompetitionPage/RulesPage'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Competition, Event} from '@/types/api/competition'
import {Seminar} from '@/utils/useSeminarInfo'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
  is_rules: boolean
}

const StaticPage: NextPage<CompetitionPageProps> = ({competition, is_rules}) => {
  return (
    <PageLayout title={competition.name}>
      {is_rules ? (
        <RulesPage
          name={competition.name}
          rules={competition.rules}
          upcoming_or_current_event={competition.upcoming_or_current_event}
        />
      ) : (
        <CompetitionPage competition={competition} />
      )}
    </PageLayout>
  )
}

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
        const {data} = await apiAxios.get<OurCompetition | undefined>(`/competition/competition/slug/${requestedUrl}`)
        if (!data) return redirectToSeminar

        if (query.params.length === 2 && query.params[1] === 'pravidla') {
          if (!data.rules) {
            return {redirect: {destination: `/${seminar}/akcie/${requestedUrl}`, permanent: false}}
          }
          return {props: {competition: data, is_rules: true}}
        }

        return {props: {competition: data, is_rules: false}}
      } catch {
        return redirectToSeminar
      }
    }

    return redirectToSeminar
  }

export const getServerSideProps = competitionBasedGetServerSideProps('strom')
