import {FC} from 'react'
import {AutocompleteInput, FormTab, ImageInput, ReferenceInput, required, TextInput} from 'react-admin'

import {MyCreateFileInput} from '@/components/Admin/custom/file-handling/MyCreateFileInput'
import {LatexImport} from '@/components/Admin/custom/latex-import/LatexImport'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyImageField} from '@/components/Admin/custom/MyImageField'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {ProblemPreview} from '@/components/Admin/custom/ProblemPreview'
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
        <TextInput source="order" validate={required()} />
        <LatexImport source="text" />
        <TextInput source="text" multiline validate={required()} helperText="content.helpers.markdown" />
        <ProblemPreview />
        <ImageInput source="image" accept={Accept.Image} helperText="content.helpers.image_formats">
          <MyImageField />
        </ImageInput>
        <MyCreateFileInput source="solution_pdf" accept={Accept.Pdf} />
      </FormTab>
    </MyTabbedForm>
  </MyCreate>
)
