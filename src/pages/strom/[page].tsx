import {Typography} from '@mui/material'
import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Markdown} from '@/components/StaticSites/Markdown'
import {FlatPage} from '@/types/api/generated/base'
import {Seminar} from '@/utils/useSeminarInfo'

type StaticPageProps = {
  debug?: any
  data?: {
    title: string
    content: string
  }
}

const StaticPage: NextPage<StaticPageProps> = ({data, debug}) => {
  if (!data) return <Typography whiteSpace="pre-wrap">{debug && JSON.stringify(debug, null, 2)}</Typography>
  const {title, content} = data
  return (
    <PageLayout title={title}>
      <Markdown content={content} />
    </PageLayout>
  )
}

export default StaticPage

// wrapper aby sme to lahko vyuzili pre ostatne seminare a neduplikovali kod
export const seminarBasedGetServerSideProps =
  (seminar: Seminar): GetServerSideProps<StaticPageProps> =>
  async ({query}) => {
    // `page` vychadza z nazvu suboru `[page]`
    // tento check je hlavne pre typescript - parameter `page` by vzdy mal existovat a vzdy ako string
    if (query?.page && typeof query.page === 'string') {
      const requestedUrl = query.page
      try {
        const {data} = await axios.get<FlatPage | undefined>(
          `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/base/flat-page/by-url/${requestedUrl}`,
        )
        // ked stranka neexistuje, vrati sa `content: ""`. teraz renderujeme stranku len ked je content neprazdny a server rovno vrati redirect.
        // druha moznost by bola nechat prazdny content handlovat clienta - napriklad zobrazit custom error, ale nechat usera na neplatnej stranke.
        // tretia moznost je miesto redirectu vratit nextovsku 404
        if (data?.content) {
          return {
            props: {data: {content: data.content, title: data.title}},
          }
        }
        return {
          props: {
            debug: {
              msg: 'chybaju data',
              calledUrl: `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/base/flat-page/by-url/${requestedUrl}`,
            },
          },
        }
      } catch (e: unknown) {
        console.log('🔴 DEBUG: error in try-catch', e)
        // return redirectToSeminar
        return {
          props: {
            debug: {
              msg: 'error in try-catch',
              error: e instanceof Error ? e.message : "no error message and can't serialize",
              calledUrl: `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/base/flat-page/by-url/${requestedUrl}`,
            },
          },
        }
      }
    }

    return {redirect: {destination: `/${seminar}`, permanent: false}}
  }

export const getServerSideProps = seminarBasedGetServerSideProps('strom')
