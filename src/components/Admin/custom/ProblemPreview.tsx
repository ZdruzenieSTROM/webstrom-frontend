import {Box} from '@mui/material'
import {ThemeProvider} from '@mui/material/styles'
import {FC} from 'react'
import {FormDataConsumer, Labeled} from 'react-admin'

import {ProblemContent} from '@/components/Problems/ProblemContent'
import {colors} from '@/theme/colors'
import {theme} from '@/theme/theme'

// ImageInput holds the saved URL as a string, but a freshly picked file as {rawFile, src, title}
const imageSrc = (image: unknown) =>
  typeof image === 'string' ? image : ((image as {src?: string} | null | undefined)?.src ?? null)

export const ProblemPreview: FC = () => (
  <FormDataConsumer>
    {({formData}) =>
      formData?.text ? (
        <Labeled label="content.labels.preview">
          <ThemeProvider theme={theme}>
            <Box sx={{color: colors.black, background: colors.white, p: '10px', width: {xs: '100%', md: '50vw'}}}>
              <ProblemContent order={formData.order ?? ''} text={formData.text} image={imageSrc(formData.image)} />
            </Box>
          </ThemeProvider>
        </Labeled>
      ) : null
    }
  </FormDataConsumer>
)
