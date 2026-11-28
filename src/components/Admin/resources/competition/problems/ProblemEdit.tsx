import {FC} from 'react'
import {AutocompleteInput, FormTab, ImageInput, ReferenceInput, required, TextInput} from 'react-admin'

import {MyEditFileInput} from '@/components/Admin/custom/file-handling/MyEditFileInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyImageField} from '@/components/Admin/custom/MyImageField'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {ProblemPreview} from '@/components/Admin/custom/ProblemPreview'
import {Accept} from '@/utils/dropzoneAccept'

import {createProblemFormData} from './createProblemFormData'

export const ProblemEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createProblemFormData(record)
      return record
    }}
  >
    <MyTabbedForm toolbar={<MyEditToolbar />}>
      <FormTab label="content.labels.general">
        <ReferenceInput source="series" reference="competition/series">
          <AutocompleteInput optionText="verbose_name" validate={required()} />
        </ReferenceInput>
        <TextInput source="order" validate={required()} />
        <TextInput
          source="text"
          multiline
          validate={required()}
          helperText="Úlohy môžu obsahovať iba TeX (iba matický mód) a Markdown (nie HTML). Návod: https://www.markdownguide.org/basic-syntax/"
        />
        <ImageInput source="image" accept={Accept.Image}>
          <MyImageField />
        </ImageInput>
        <MyEditFileInput source="solution_pdf" accept={Accept.Pdf} />
        <ProblemPreview />
      </FormTab>
    </MyTabbedForm>
  </MyEdit>
)
