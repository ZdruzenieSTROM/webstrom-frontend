import {FC, useState} from 'react'
import {FormDataConsumer} from 'react-admin'

import {Post} from '@/components/Posts/Post'
import {PostDetail} from '@/components/Posts/PostDetail'

export const PostPreview: FC = () => {
  const [isDetailOpen, openDetail] = useState<boolean>()
  return (
    <FormDataConsumer>
      {({formData}) => {
        return (
          <>
            <Post
              id={0}
              links={formData?.links ?? []}
              caption={formData?.caption ?? ''}
              short_text={formData?.short_text ?? ''}
              details={formData?.details ?? ''}
              added_at={formData?.added_at ?? ''}
              visible_after={formData?.visible_after ?? ''}
              visible_until={formData?.visible_until ?? ''}
              sites={formData?.sites ?? []}
              openDetail={() => {
                openDetail(true)
              }}
            />
            {isDetailOpen && <PostDetail caption={formData?.caption ?? ''} details={formData?.details ?? ''} />}
          </>
        )
      }}
    </FormDataConsumer>
  )
}
