import {FC} from 'react'
import {
  AutocompleteInput,
  FileInput,
  FormTab,
  ImageInput,
  ReferenceInput,
  required,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {LatexPreview} from '@/components/Admin/custom/LatexPreview'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {MyImageField} from '@/components/Admin/custom/MyImageField'
import {Accept} from '@/utils/dropzone-accept'

import {createProblemFormData} from './createProblemFormData'

export const ProblemEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createProblemFormData(record)
      return record
    }}
  >
    <TabbedForm>
      <FormTab label="content.labels.general">
        <ReferenceInput source="series" reference="competition/series">
          <AutocompleteInput optionText="verbose_name" validate={required()} />
        </ReferenceInput>
        <TextInput
          source="text"
          multiline
          fullWidth
          validate={required()}
          helperText="Úlohy môžu obsahovať iba TeX a Markdown (nie HTML). Návod: https://www.markdownguide.org/basic-syntax/"
        />
        <LatexPreview source="text" />
        <TextInput source="order" fullWidth validate={required()} />
        <ImageInput source="image" accept={Accept.Image}>
          <MyImageField />
        </ImageInput>
        <FileInput source="solution_pdf" accept={Accept.Pdf}>
          <MyFileField />
        </FileInput>
      </FormTab>
    </TabbedForm>
  </MyEdit>
)
