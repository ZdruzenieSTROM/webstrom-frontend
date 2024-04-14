import {ThemeProvider} from '@mui/material/styles'
import {FC} from 'react'
import {FormDataConsumer} from 'react-admin'

import {Markdown} from '@/components/StaticSites/Markdown'
import {theme} from '@/theme'

export const FlatpagePreview: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <FormDataConsumer>{({formData}) => <Markdown content={formData.content} />}</FormDataConsumer>
    </ThemeProvider>
  )
}
