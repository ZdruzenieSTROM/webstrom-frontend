import {FC, useState} from 'react'
import {AutocompleteInput, FormTab, ReferenceInput, required, TextInput} from 'react-admin'

import {MyCreateFileInput} from '@/components/Admin/custom/file-handling/MyCreateFileInput'
import {LatexImport} from '@/components/Admin/custom/latex-import/LatexImport'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {ProblemPreview} from '@/components/Admin/custom/ProblemPreview'
import {Accept} from '@/utils/dropzoneAccept'

import {createProblemFormData} from './createProblemFormData'
import {ProblemImageInput} from './ProblemImageInput'

export const ProblemCreate: FC = () => {
  const [converting, setConverting] = useState(false)

  return (
    <MyCreate
      transform={(record) => {
        record.formData = createProblemFormData(record)
        return record
      }}
    >
      <MyTabbedForm toolbar={<MyCreateToolbar disableSave={converting} dontResetFields={['series']} />}>
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
          <MyCreateFileInput source="solution_pdf" accept={Accept.Pdf} />
        </FormTab>
      </MyTabbedForm>
    </MyCreate>
  )
}
