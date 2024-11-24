import {FC} from 'react'
import {FieldProps, FormDataConsumer, Labeled} from 'react-admin'

import {Latex} from '@/components/Latex/Latex'

export const LatexPreview: FC<FieldProps> = ({source}) => {
  if (!source) return null

  return (
    <Labeled label="content.labels.preview">
      <FormDataConsumer>
        {({formData}) => {
          const data = formData[source]
          if (!data) return null

          return <Latex>{data}</Latex>
        }}
      </FormDataConsumer>
    </Labeled>
  )
}
