import {FC} from 'react'
import {SimpleForm, SimpleFormProps} from 'react-admin'

export const MySimpleForm: FC<SimpleFormProps> = (props) => <SimpleForm warnWhenUnsavedChanges {...props} />
