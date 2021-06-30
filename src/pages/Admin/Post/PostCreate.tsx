import {FC} from 'react'
import {ArrayInput, Create, CreateProps, DateInput, SimpleForm, SimpleFormIterator, TextInput} from 'react-admin'

// TODO: treba zistit, ako ma vyzerat tento PUT request a teda form, potom otestovat
export const PostCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm>
      {/* <NumberInput source="id" fullWidth /> */}
      <TextInput source="caption" fullWidth />
      <TextInput source="short_text" fullWidth />
      <TextInput source="details" fullWidth />
      <DateInput source="added_at" fullWidth />
      <DateInput source="show_after" fullWidth />
      <DateInput source="disable_after" fullWidth />
      <ArrayInput source="links">
        <SimpleFormIterator>
          {/* <NumberInput source="id" fullWidth /> */}
          <TextInput source="caption" fullWidth />
          <TextInput source="url" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
)
