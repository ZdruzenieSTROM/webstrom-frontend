import {FC} from 'react'
import {TabbedForm, TabbedFormProps, useCreatePath, useRecordContext, useResourceContext} from 'react-admin'

export const MyTabbedForm: FC<TabbedFormProps> = (props) => {
  const resource = useResourceContext(props)
  const record = useRecordContext(props)
  const createPath = useCreatePath()

  const formRootPathname =
    resource &&
    (record?.id == null ? createPath({resource, type: 'create'}) : createPath({resource, id: record.id, type: 'edit'}))

  return <TabbedForm warnWhenUnsavedChanges formRootPathname={formRootPathname} {...props} />
}
