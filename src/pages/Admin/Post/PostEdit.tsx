import {FC} from 'react'
import {
  ArrayInput,
  DateInput,
  Edit,
  EditActionsProps,
  EditProps,
  FormTab,
  ListButton,
  NumberInput,
  ShowButton,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
  TopToolbar,
} from 'react-admin'

const PostEditActions: FC<EditActionsProps> = ({basePath, data}) => (
  <TopToolbar>
    <ShowButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
  </TopToolbar>
)

export const PostEdit: FC<EditProps> = (props) => (
  <Edit {...props} actions={<PostEditActions />}>
    <TabbedForm>
      <FormTab label="general">
        <NumberInput source="id" fullWidth />
        <TextInput source="caption" fullWidth />
        <TextInput source="short_text" fullWidth />
        <TextInput source="details" fullWidth />
        <DateInput source="added_at" fullWidth />
        <DateInput source="show_after" fullWidth />
        <DateInput source="disable_after" fullWidth />
      </FormTab>
      <FormTab label="links">
        <ArrayInput source="links">
          <SimpleFormIterator>
            <NumberInput source="id" fullWidth />
            <TextInput source="caption" fullWidth />
            <TextInput source="url" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
)
