import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Markdown} from '@/components/StaticSites/Markdown'
import {FlatPage} from '@/types/api/generated/base'
import {Seminar} from '@/utils/useSeminarInfo'

type StaticPageProps = {
  title: string
  content: string
}

const StaticPage: NextPage<StaticPageProps> = ({title, content}) => (
  <PageLayout title={title}>
    <Markdown content={content} />
  </PageLayout>
)

export default StaticPage

// wrapper aby sme to lahko vyuzili pre ostatne seminare a neduplikovali kod
export const seminarBasedGetServerSideProps = (seminar: Seminar): GetServerSideProps<StaticPageProps> => async ({
  query,
}) => {
  // `page` vychadza z nazvu suboru `[page]`
  // tento check je hlavne pre typescript - parameter `page` by vzdy mal existovat a vzdy ako string
  if (query?.page && typeof query.page === 'string') {
    const requestedUrl = query.page
    const {data} = await axios.get<FlatPage | undefined>(
      `${process.env.NEXT_PUBLIC_BE_URL}/base/flat-page/by-url/${requestedUrl}/`,
    )
    // ked stranka neexistuje, vrati sa `content: ""`. teraz renderujeme stranku len ked je content neprazdny a server rovno vrati redirect.
    // druha moznost by bola nechat prazdny content handlovat clienta - napriklad zobrazit custom error, ale nechat usera na neplatnej stranke.
    // tretia moznost je miesto redirectu vratit nextovsku 404
    if (data?.content) {
      return {
        props: {content: data.content, title: data.title},
      }
    }
  }

  return {redirect: {destination: `/${seminar}`, permanent: false}}
}

export const getServerSideProps = seminarBasedGetServerSideProps('strom')
