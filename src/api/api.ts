import {IPost} from '@/components/Posts/Post'
import {FlatPage} from '@/types/api/base'
import {Competition, Event} from '@/types/api/competition'
import {SeminarId} from '@/utils/useSeminarInfo'

import {apiAxios} from './apiAxios'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

export const apiOptions = {
  cms: {
    post: {
      visible: (seminarId: SeminarId) => ({
        queryKey: ['cms', 'post', 'visible', seminarId],
        queryFn: () => apiAxios.get<IPost[]>(`/cms/post/visible?sites=${seminarId}`).then((res) => res.data),
      }),
    },
    flatPage: {
      byUrl: (pageUrl: string) => ({
        queryKey: ['cms', 'flat-page', 'by-url', pageUrl],
        queryFn: () => apiAxios.get<FlatPage>(`/cms/flat-page/by-url/${pageUrl}`).then((res) => res.data),
      }),
    },
  },
  competition: {
    competition: {
      slug: (slug: string) => ({
        queryKey: ['competition', 'competition', 'slug', slug],
        queryFn: () => apiAxios.get<OurCompetition>(`/competition/competition/slug/${slug}`).then((res) => res.data),
      }),
    },
  },
}
