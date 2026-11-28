import {FC} from 'react'
import {AutocompleteInput, FormTab, ImageInput, ReferenceInput, required, TextInput} from 'react-admin'

import {MyCreateFileInput} from '@/components/Admin/custom/file-handling/MyCreateFileInput'
import {LatexPreview} from '@/components/Admin/custom/LatexPreview'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyImageField} from '@/components/Admin/custom/MyImageField'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {Accept} from '@/utils/dropzoneAccept'

import {createProblemFormData} from './createProblemFormData'

export const ProblemCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createProblemFormData(record)
      return record
    }}
  >
    <MyTabbedForm toolbar={<MyCreateToolbar dontResetFields={['series']} />}>
      <FormTab label="content.labels.general">
        <ReferenceInput source="series" reference="competition/series">
          <AutocompleteInput optionText="verbose_name" validate={required()} />
        </ReferenceInput>
        <TextInput
          source="text"
          multiline
          validate={required()}
          helperText="Úlohy môžu obsahovať iba TeX (iba matický mód) a Markdown (nie HTML). Návod: https://www.markdownguide.org/basic-syntax/"
        />
        <LatexPreview source="text" />
        <TextInput source="order" validate={required()} />
        <ImageInput source="image" accept={Accept.Image} helperText="Povolené iba obrázkové formáty .jpeg, .jpg a .png">
          <MyImageField />
        </ImageInput>
        <MyCreateFileInput source="solution_pdf" accept={Accept.Pdf} />
      </FormTab>
    </MyTabbedForm>
  </MyCreate>
)
