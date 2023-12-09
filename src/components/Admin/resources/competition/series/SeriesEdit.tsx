import {FC} from 'react'
import {ArrayInput, DateInput, FormTab, SimpleFormIterator, TabbedForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

// TODO: premysliet a prerobit rozhranie, mozno ako u postov - pri kliku na riadok ukazat Show, kde budu priklady
// (nie ako teraz v zanorenom Datagride)
export const SeriesEdit: FC = () => (
  <MyEdit>
    <TabbedForm>
      <FormTab label="general">
        <DateInput source="deadline" fullWidth />
        <TextInput source="order" fullWidth />
      </FormTab>
      <FormTab label="problems">
        <ArrayInput source="problems">
          <SimpleFormIterator>
            <TextInput source="text" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </MyEdit>
)
