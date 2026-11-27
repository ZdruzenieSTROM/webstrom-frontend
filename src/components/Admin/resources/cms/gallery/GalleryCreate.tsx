import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, TextInput} from 'react-admin'
import {useSearchParams} from 'react-router-dom'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const GalleryCreate: FC = () => {
  const [searchParams] = useSearchParams()

  return (
    <MyCreate
      transform={(record) => {
        if (record.event && typeof record.event === 'object') {
          record.event = record.event.id
        }
        return record
      }}
    >
      <MySimpleForm toolbar={<MyCreateToolbar />}>
        <TextInput source="name" validate={required()} />
        <TextInput source="gallery_link" validate={required()} />
        <ReferenceInput source="event" reference="competition/event">
          <AutocompleteInput
            optionText="verbose_name"
            defaultValue={searchParams.get('parent_id')}
            validate={required()}
          />
        </ReferenceInput>
      </MySimpleForm>
    </MyCreate>
  )
}
