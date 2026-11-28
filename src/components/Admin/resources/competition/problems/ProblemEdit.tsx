import {FC, useState} from 'react'
import {AutocompleteInput, FormTab, ReferenceInput, required, TextInput} from 'react-admin'

import {MyEditFileInput} from '@/components/Admin/custom/file-handling/MyEditFileInput'
import {LatexImport} from '@/components/Admin/custom/latex-import/LatexImport'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {ProblemPreview} from '@/components/Admin/custom/ProblemPreview'
import {Accept} from '@/utils/dropzoneAccept'

import {createProblemFormData} from './createProblemFormData'
import {ProblemImageInput} from './ProblemImageInput'

export const ProblemEdit: FC = () => {
  const [converting, setConverting] = useState(false)

  return (
    <MyEdit
      transform={(record) => {
        record.formData = createProblemFormData(record)
        return record
      }}
    >
      <MyTabbedForm toolbar={<MyEditToolbar disableSave={converting} />}>
        <FormTab label="content.labels.general">
          <ReferenceInput source="series" reference="competition/series">
            <AutocompleteInput optionText="verbose_name" validate={required()} />
          </ReferenceInput>
          <TextInput source="order" validate={required()} />
          <LatexImport source="text" />
          <TextInput
            source="text"
            multiline
            validate={required()}
            helperText="Úlohy môžu obsahovať iba TeX (iba matický mód) a Markdown (nie HTML). Návod: https://www.markdownguide.org/basic-syntax/"
          />
          <ProblemPreview />
          <ProblemImageInput converting={converting} setConverting={setConverting} />
          <MyEditFileInput source="solution_pdf" accept={Accept.Pdf} />
        </FormTab>
      </MyTabbedForm>
    </MyEdit>
  )
}
