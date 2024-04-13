import {FC} from 'react'
import {FileInput, FormTab, ImageInput, ReferenceInput, required, SelectInput, TabbedForm, TextInput} from 'react-admin'

import {LatexPreview} from '@/components/Admin/custom/LatexPreview'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {MyImageField} from '@/components/Admin/custom/MyImageField'

import {createProblemFormData} from './createProblemFormData'

export const ProblemCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createProblemFormData(record)
      return record
    }}
  >
    <TabbedForm>
      <FormTab label="general">
        <ReferenceInput source="series" reference="competition/series">
          <SelectInput fullWidth validate={required()} />
        </ReferenceInput>
        <TextInput source="text" multiline fullWidth validate={required()} />
        <LatexPreview source="text" />
        <TextInput source="order" fullWidth validate={required()} />
        <ImageInput source="image" accept="image/*">
          <MyImageField />
        </ImageInput>
        <FileInput source="solution_pdf" accept="application/pdf">
          <MyFileField />
        </FileInput>
      </FormTab>
    </TabbedForm>
  </MyCreate>
)
