import {IPost} from '@/components/Posts/Post'
import {FlatPage} from '@/types/api/base'
import {SeminarId} from '@/utils/useSeminarInfo'

import {apiAxios} from './apiAxios'

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
}
