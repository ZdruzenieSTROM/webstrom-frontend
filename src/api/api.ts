import {IPost} from '@/components/Posts/Post'
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
  },
}
