import {FC} from 'react'
import {FieldProps, FormDataConsumer, Labeled} from 'react-admin'

import {Markdown} from '@/components/Markdown/Markdown'

export const LatexPreview: FC<FieldProps> = ({source}) => {
  if (!source) return null

  return (
    <Labeled label="content.labels.preview">
      <FormDataConsumer>
        {({formData}) => {
          const data = formData[source]
          if (!data) return null

          return <Markdown content={data} />
        }}
      </FormDataConsumer>
    </Labeled>
  )
}
