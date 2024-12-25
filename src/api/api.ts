import {ILogo} from '@/components/PageLayout/Footer/Logo'
import {IPost} from '@/components/Posts/Post'
import {FlatPage} from '@/types/api/base'
import {MenuItemShort} from '@/types/api/cms'
import {Competition, Event} from '@/types/api/competition'
import {Profile} from '@/types/api/personal'
import {SeminarId} from '@/utils/useSeminarInfo'

import {apiAxios} from './apiAxios'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

export const apiOptions = {
  cms: {
    flatPage: {
      byUrl: (pageUrl: string) => ({
        queryKey: ['cms', 'flat-page', 'by-url', pageUrl],
        queryFn: () => apiAxios.get<FlatPage>(`/cms/flat-page/by-url/${pageUrl}`).then((res) => res.data),
      }),
    },
    logo: () => ({
      queryKey: ['cms', 'logo'],
      queryFn: () => apiAxios.get<ILogo[]>('/cms/logo').then((res) => res.data),
    }),
    menuItem: {
      onSite: (seminarId: SeminarId, type: 'menu' | 'footer') => ({
        queryKey: ['cms', 'menu-item', 'on-site', seminarId, type],
        queryFn: () =>
          apiAxios.get<MenuItemShort[]>(`/cms/menu-item/on-site/${seminarId}?type=${type}`).then((res) => res.data),
      }),
    },
    post: {
      visible: (seminarId: SeminarId) => ({
        queryKey: ['cms', 'post', 'visible', seminarId],
        queryFn: () => apiAxios.get<IPost[]>(`/cms/post/visible?sites=${seminarId}`).then((res) => res.data),
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
  personal: {
    profiles: {
      myprofile: () => ({
        queryKey: ['personal', 'profiles', 'myprofile'],
        queryFn: () => apiAxios.get<Profile>('/personal/profiles/myprofile').then((res) => res.data),
      }),
    },
  },
}
