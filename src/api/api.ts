import {AxiosInstance, AxiosResponse} from 'axios'
import {GetServerSidePropsContext} from 'next'

import {ILogo} from '@/components/PageLayout/Footer/Logo'
import {IPost} from '@/components/Posts/Post'
import {FlatPage} from '@/types/api/base'
import {MenuItemShort} from '@/types/api/cms'
import {
  Competition,
  Event,
  ProblemWithSolutions,
  Result,
  Semester,
  SemesterWithProblems,
  SeriesWithProblems,
} from '@/types/api/competition'
import {Profile} from '@/types/api/personal'
import {SeminarId} from '@/utils/useSeminarInfo'

import {apiAxios, newApiAxios} from './apiAxios'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

const unwrap = <T>(response: Promise<AxiosResponse<T>>) => response.then((res) => res.data)

// kod chceme zdielat medzi serverom a clientom (browserom). client axios automaticky zahrna cookies,
// no na serveri musime cookies/headers z originalneho requestu pridat do axiosu explicitne - preto ina instancia.
// nase typy povacsine maju fieldy `number | undefined`, ale z BE chodi niekde aj null (semester v kritickych pripadoch).
// preto tu mame enabled checky ako `!= null`, co kontroluje aj null aj undefined
export const createApiOptions = (axiosInstance: AxiosInstance) => ({
  cms: {
    flatPage: {
      byUrl: (pageUrl: string) => ({
        queryKey: ['cms', 'flat-page', 'by-url', pageUrl],
        queryFn: () => unwrap(axiosInstance.get<FlatPage>(`/cms/flat-page/by-url/${pageUrl}`)),
      }),
    },
    infoBanner: {
      competition: (competitionId: number | undefined) => ({
        queryKey: ['cms', 'info-banner', 'competition', competitionId],
        queryFn: () => unwrap(axiosInstance.get<string[]>(`/cms/info-banner/competition/${competitionId}`)),
        enabled: competitionId != null,
      }),
      seriesProblems: (seriesId: number | undefined) => ({
        queryKey: ['cms', 'info-banner', 'series-problems', seriesId],
        queryFn: () => unwrap(axiosInstance.get<string[]>(`/cms/info-banner/series-problems/${seriesId}`)),
        enabled: seriesId != null,
      }),
      seriesResults: (seriesId: number | undefined) => ({
        queryKey: ['cms', 'info-banner', 'series-results', seriesId],
        queryFn: () => unwrap(axiosInstance.get<string[]>(`/cms/info-banner/series-results/${seriesId}`)),
        enabled: seriesId != null,
      }),
    },
    logo: () => ({
      queryKey: ['cms', 'logo'],
      queryFn: () => unwrap(axiosInstance.get<ILogo[]>('/cms/logo')),
    }),
    menuItem: {
      onSite: (seminarId: SeminarId, type: 'menu' | 'footer') => ({
        queryKey: ['cms', 'menu-item', 'on-site', seminarId, type],
        queryFn: () => unwrap(axiosInstance.get<MenuItemShort[]>(`/cms/menu-item/on-site/${seminarId}?type=${type}`)),
      }),
    },
    post: {
      visible: (seminarId: SeminarId) => ({
        queryKey: ['cms', 'post', 'visible', seminarId],
        queryFn: () => unwrap(axiosInstance.get<IPost[]>(`/cms/post/visible?sites=${seminarId}`)),
      }),
    },
  },
  competition: {
    competition: {
      slug: (slug: string) => ({
        queryKey: ['competition', 'competition', 'slug', slug],
        queryFn: () => unwrap(axiosInstance.get<OurCompetition>(`/competition/competition/slug/${slug}`)),
      }),
    },
    semesterList: (seminarId: SeminarId) => ({
      queryKey: ['competition', 'semester-list', {competition: seminarId}],
      queryFn: () => unwrap(axiosInstance.get<Semester[]>(`/competition/semester-list?competition=${seminarId}`)),
    }),
    series: {
      byId: (seriesId: number | undefined | null) => ({
        queryKey: ['competition', 'series', seriesId],
        queryFn: () => unwrap(axiosInstance.get<SeriesWithProblems>(`/competition/series/${seriesId}`)),
        enabled: seriesId != null,
      }),
      current: (seminarId: SeminarId) => ({
        queryKey: ['competition', 'series', 'current', seminarId],
        queryFn: () => unwrap(axiosInstance.get<SeriesWithProblems>(`/competition/series/current/${seminarId}`)),
      }),
      results: (seriesId: number | undefined | null) => ({
        queryKey: ['competition', 'series', seriesId, 'results'],
        queryFn: () => unwrap(axiosInstance.get<Result[]>(`/competition/series/${seriesId}/results`)),
        enabled: seriesId != null,
      }),
    },
    semester: {
      byId: (semesterId: number | undefined | null) => ({
        queryKey: ['competition', 'semester', semesterId],
        queryFn: () => unwrap(axiosInstance.get<SemesterWithProblems>(`/competition/semester/${semesterId}`)),
        enabled: semesterId != null,
      }),
      results: (semesterId: number | undefined | null) => ({
        queryKey: ['competition', 'semester', semesterId, 'results'],
        queryFn: () => unwrap(axiosInstance.get<Result[]>(`/competition/semester/${semesterId}/results`)),
        enabled: semesterId != null,
      }),
    },
    problemAdministration: {
      byId: (problemId: string | undefined | null) => ({
        queryKey: ['competition', 'problem-administration', problemId],
        queryFn: () =>
          unwrap(axiosInstance.get<ProblemWithSolutions>(`/competition/problem-administration/${problemId}`)),
        enabled: problemId != null,
      }),
    },
  },
  personal: {
    profiles: {
      myprofile: () => ({
        queryKey: ['personal', 'profiles', 'myprofile'],
        queryFn: () => unwrap(axiosInstance.get<Profile>('/personal/profiles/myprofile')),
      }),
    },
  },
})

// Default export using the global apiAxios instance (for client-side use)
export const apiOptions = createApiOptions(apiAxios)

// Convenience helper for SSR - creates API options with request context
export const createSSRApiOptions = (req?: GetServerSidePropsContext['req']) => {
  const ssrAxios = newApiAxios(req)
  return createApiOptions(ssrAxios)
}
