import {FC} from 'react'
import {FormDataConsumer, Labeled, useRecordContext} from 'react-admin'

import {ProblemContent} from '@/components/Problems/ProblemContent'

import {SitePreview} from './SitePreview'

type ProblemFormValues = {
  text?: string
  order?: number | string
  // ImageInput holds the saved URL as a string, but a freshly picked file as {rawFile, src, title}
  image?: string | {src: string} | null
}

export const ProblemPreview: FC = () => (
  <FormDataConsumer<ProblemFormValues>>
    {({formData: {text, order, image}}) =>
      text ? (
        <Labeled label="content.labels.preview">
          <SitePreview>
            <ProblemContent
              order={order || '?'}
              text={text}
              image={typeof image === 'string' ? image : (image?.src ?? null)}
            />
          </SitePreview>
        </Labeled>
      ) : null
    }
  </FormDataConsumer>
)

type ProblemRecord = {
  text: string
  order: number
  image: string | null
}

// SimpleShowLayout reads `label` off its children to label the row; the component itself ignores it.
export const ProblemRecordPreview: FC<{label?: string}> = () => {
  const record = useRecordContext<ProblemRecord>()
  if (!record) return null

  return (
    <SitePreview>
      <ProblemContent order={record.order} text={record.text} image={record.image} />
    </SitePreview>
  )
}
