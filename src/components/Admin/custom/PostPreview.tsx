import {FC, useState} from 'react'
import {FormDataConsumer} from 'react-admin'

import {Post} from '@/components/Posts/Post'

import {SitePreview} from './SitePreview'

export const PostPreview: FC = () => {
  const [now] = useState(() => new Date().toISOString())

  return (
    <FormDataConsumer>
      {({formData}) => (
        <SitePreview>
          <Post
            id={0}
            links={formData?.links ?? []}
            caption={formData?.caption ?? ''}
            short_text={formData?.short_text ?? ''}
            details={formData?.details ?? ''}
            added_at={formData?.added_at ?? now}
            visible_after={formData?.visible_after ?? ''}
            visible_until={formData?.visible_until ?? ''}
            sites={formData?.sites ?? []}
          />
        </SitePreview>
      )}
    </FormDataConsumer>
  )
}
