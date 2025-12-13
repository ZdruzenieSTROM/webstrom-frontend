import {FC} from 'react'
import {AutocompleteInput, FormTab, ImageInput, ReferenceInput, required, TabbedForm, TextInput} from 'react-admin'

import {MyEditFileInput} from '@/components/Admin/custom/file-handling/MyEditFileInput'
import {LatexPreview} from '@/components/Admin/custom/LatexPreview'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyImageField} from '@/components/Admin/custom/MyImageField'
import {Accept} from '@/utils/dropzoneAccept'

import {createProblemFormData} from './createProblemFormData'

export const ProblemEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createProblemFormData(record)
      return record
    }}
  >
    <TabbedForm toolbar={<MyEditToolbar />}>
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
        <ImageInput source="image" accept={Accept.Image}>
          <MyImageField />
        </ImageInput>
        <MyEditFileInput source="solution_pdf" accept={Accept.Pdf} />
      </FormTab>
    </TabbedForm>
  </MyEdit>
)
