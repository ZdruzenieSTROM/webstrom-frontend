import {Typography} from '@mui/material'
import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'

import {CompetitionPage} from '@/components/CompetitionPage/CompetitionPage'
import {RulesPage} from '@/components/CompetitionPage/RulesPage'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Competition, Event} from '@/types/api/competition'
import {Seminar} from '@/utils/useSeminarInfo'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  debug?: any
  data?: {
    competition: OurCompetition
    is_rules: boolean
  }
}

const StaticPage: NextPage<CompetitionPageProps> = ({data, debug}) => {
  if (!data) return <Typography whiteSpace="pre-wrap">{debug && JSON.stringify(debug, null, 2)}</Typography>
  const {competition, is_rules} = data

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
    // const redirectToSeminar = {redirect: {destination: `/${seminar}`, permanent: false}}
    const redirectToSeminar = {props: {destination: `/${seminar}`, permanent: false}}

    // `params` vychadza z nazvu suboru `[[...params]]`
    // tento check je hlavne pre typescript - parameter `params` by vzdy mal existovat a mal by byt typu string[]
    if (query?.params && Array.isArray(query.params) && query.params.length > 0) {
      const requestedUrl = query.params[0]

      try {
        console.log(
          '🔵 DEBUG: calling',
          `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/competition/competition/slug/${requestedUrl}`,
        )
        const {data} = await axios.get<OurCompetition | undefined>(
          `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/competition/competition/slug/${requestedUrl}`,
        )
        console.log('🔵 DEBUG: data:', data && JSON.stringify(data))
        // if (!data) return redirectToSeminar
        if (!data)
          return {
            props: {
              debug: {
                msg: 'chybaju data',
                calledUrl: `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/competition/competition/slug/${requestedUrl}`,
              },
            },
          }

        if (query.params.length === 2 && query.params[1] === 'pravidla') {
          if (!data.rules) {
            return {redirect: {destination: `/${seminar}/akcie/${requestedUrl}`, permanent: false}}
          }
          return {props: {data: {competition: data, is_rules: true}}}
        }

        return {props: {data: {competition: data, is_rules: false}}}
      } catch (e: unknown) {
        console.log('🔴 DEBUG: error in try-catch', e)
        // return redirectToSeminar
        return {
          props: {
            debug: {
              msg: 'error in try-catch',
              error: e instanceof Error ? e.message : "no error message and can't serialize",
              calledUrl: `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/competition/competition/slug/${requestedUrl}`,
            },
          },
        }
        // throw e
      }
    }

    console.log("🔴 DEBUG: didn't pass query.params typecheck", query?.params)

    // return redirectToSeminar
    return {
      props: {
        debug: {
          msg: "didn't pass query.params typecheck",
          query: query,
        },
      },
    }
  }

export const getServerSideProps = competitionBasedGetServerSideProps('strom')
