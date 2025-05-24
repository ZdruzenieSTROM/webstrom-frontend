import ContentAdd from '@mui/icons-material/Add'
import {FC, ReactNode} from 'react'
import {Button, ButtonProps, useCreatePath, useEditContext, useTranslate} from 'react-admin'
import {Link} from 'react-router-dom'

type MyCreateButtonProps = ButtonProps & {
  resource: string
  icon?: ReactNode
  label?: string
}

export const MyCreateButton: FC<MyCreateButtonProps> = ({
  resource,
  icon = <ContentAdd />,
  label = 'ra.action.create',
  ...rest
}) => {
  const translate = useTranslate()
  const path = useCreatePath()
  const context = useEditContext()

  return (
    <Button
      component={Link}
      label={translate(label)}
      to={`${path({resource, type: 'create'})}?parent_id=${context.record.id}`}
      {...rest}
    >
      {icon}
    </Button>
  )
}
