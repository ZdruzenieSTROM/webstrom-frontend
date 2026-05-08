import {mutationOptions} from '@tanstack/react-query'
import {AxiosInstance, AxiosResponse} from 'axios'
import {GetServerSidePropsContext} from 'next'

import {ILogo} from '@/components/PageLayout/Footer/Logo'
import {IPost} from '@/components/Posts/Post'
import {FlatPage} from '@/types/api/base'
import {MenuItemShort} from '@/types/api/cms'
import {
  Comment,
  Competition,
  Event,
  Grade,
  ProblemWithSolutions,
  Result,
  Semester,
  SemesterWithProblems,
  SeriesWithProblems,
  SolutionAdministration,
} from '@/types/api/competition'
import {IGeneralPostResponse} from '@/types/api/general'
import {ISchool, MyPermissions, Profile} from '@/types/api/personal'
import {Login, Token} from '@/types/api/user'
import {Seminar, SeminarId} from '@/utils/useSeminarInfo'

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
    event: {
      // .list is the bare /event/ endpoint; named like this because `event` is also a namespace for /event/{id}/register
      list: (seminarId: SeminarId) => ({
        queryKey: ['competition', 'event', {competition: seminarId}],
        queryFn: () => unwrap(axiosInstance.get<Event[]>(`/competition/event/?competition=${seminarId}`)),
      }),
      register: () =>
        mutationOptions({
          mutationFn: (eventId: number) => unwrap(axiosInstance.post(`/competition/event/${eventId}/register`)),
        }),
    },
    grade: () => ({
      queryKey: ['competition', 'grade'],
      queryFn: () => unwrap(axiosInstance.get<Grade[]>('/competition/grade')),
    }),
    problem: {
      comments: (problemId: number | undefined) => ({
        queryKey: ['competition', 'problem', problemId, 'comments'],
        queryFn: () => unwrap(axiosInstance.get<Comment[]>(`/competition/problem/${problemId}/comments`)),
        enabled: problemId != null,
      }),
      addComment: () =>
        mutationOptions({
          mutationFn: ({problemId, text}: {problemId: number; text: string}) =>
            unwrap(axiosInstance.post(`/competition/problem/${problemId}/add-comment`, {text})),
        }),
      uploadCorrected: () =>
        mutationOptions({
          mutationFn: ({problemId, data}: {problemId: string; data: FormData}) =>
            unwrap(axiosInstance.post(`/competition/problem/${problemId}/upload-corrected`, data)),
        }),
      // intentionally NOT unwrapped — consumer differentiates 200/201 in onSuccess via response.status
      uploadSolution: () =>
        mutationOptions({
          mutationFn: ({problemId, data}: {problemId: number; data: FormData}) =>
            axiosInstance.post(`/competition/problem/${problemId}/upload-solution`, data),
        }),
    },
    comment: {
      publish: () =>
        mutationOptions({
          mutationFn: (commentId: number) => unwrap(axiosInstance.post(`/competition/comment/${commentId}/publish`)),
        }),
      hide: () =>
        mutationOptions({
          mutationFn: ({commentId, hiddenResponse}: {commentId: number; hiddenResponse: string}) =>
            unwrap(axiosInstance.post(`/competition/comment/${commentId}/hide`, {hidden_response: hiddenResponse})),
        }),
      delete: () =>
        mutationOptions({
          mutationFn: (commentId: number) => unwrap(axiosInstance.delete(`/competition/comment/${commentId}`)),
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
      results: {
        // .list is the bare /series/{id}/results GET; `results` is also a namespace for /freeze and /unfreeze
        list: (seriesId: number | undefined | null) => ({
          queryKey: ['competition', 'series', seriesId, 'results'],
          queryFn: () => unwrap(axiosInstance.get<Result[]>(`/competition/series/${seriesId}/results`)),
          enabled: seriesId != null,
        }),
        freeze: () =>
          mutationOptions({
            mutationFn: (seriesId: number) =>
              unwrap(axiosInstance.post(`/competition/series/${seriesId}/results/freeze`)),
          }),
        unfreeze: () =>
          mutationOptions({
            mutationFn: (seriesId: number) =>
              unwrap(axiosInstance.post(`/competition/series/${seriesId}/results/unfreeze`)),
          }),
      },
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
      uploadPoints: () =>
        mutationOptions({
          mutationFn: ({problemId, solutionSet}: {problemId: string; solutionSet: SolutionAdministration[]}) =>
            unwrap(
              axiosInstance.post(`/competition/problem-administration/${problemId}/upload-points`, {
                solution_set: solutionSet,
              }),
            ),
        }),
    },
  },
  personal: {
    profiles: {
      myprofile: () => ({
        queryKey: ['personal', 'profiles', 'myprofile'],
        queryFn: () => unwrap(axiosInstance.get<Profile>('/personal/profiles/myprofile')),
      }),
      mypermissions: () => ({
        queryKey: ['personal', 'profiles', 'mypermissions'],
        queryFn: () => unwrap(axiosInstance.get<MyPermissions>('/personal/profiles/mypermissions')),
      }),
    },
    schools: () => ({
      queryKey: ['personal', 'schools'],
      queryFn: () => unwrap(axiosInstance.get<ISchool[]>('/personal/schools')),
    }),
  },
  user: {
    login: () =>
      mutationOptions({
        mutationFn: (data: Login) => unwrap(axiosInstance.post<Token>('/user/login', data)),
      }),
    logout: () =>
      mutationOptions({
        mutationFn: () => unwrap(axiosInstance.post('/user/logout')),
      }),
    registration: {
      // .create is the bare /user/registration POST; `registration` is also a namespace for /verify-email
      create: () =>
        mutationOptions({
          mutationFn: ({seminar, data}: {seminar: Seminar; data: unknown}) =>
            unwrap(axiosInstance.post<IGeneralPostResponse>(`/user/registration?seminar=${seminar}`, data)),
        }),
      verifyEmail: () =>
        mutationOptions({
          mutationFn: ({key}: {key: string}) => unwrap(axiosInstance.post('/user/registration/verify-email', {key})),
        }),
    },
    user: () =>
      mutationOptions({
        mutationFn: (data: unknown) => unwrap(axiosInstance.patch<IGeneralPostResponse>('/user/user', data)),
      }),
    password: {
      change: () =>
        mutationOptions({
          mutationFn: (data: {old_password: string; new_password1: string; new_password2: string}) =>
            unwrap(axiosInstance.post<IGeneralPostResponse>('/user/password/change', data)),
        }),
      reset: {
        // .request is the bare /user/password/reset POST; `reset` is also a namespace for /confirm
        request: () =>
          mutationOptions({
            mutationFn: (data: {email: string}) =>
              unwrap(axiosInstance.post<IGeneralPostResponse>('/user/password/reset', data)),
          }),
        confirm: () =>
          mutationOptions({
            mutationFn: (data: {new_password1?: string; new_password2?: string; uid: string; token: string}) =>
              unwrap(axiosInstance.post<IGeneralPostResponse>('/user/password/reset/confirm', data)),
          }),
      },
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
