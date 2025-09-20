import {Grid, Stack} from '@mui/material'
import {ThemeProvider} from '@mui/material/styles'
import {FC} from 'react'
import {FormDataConsumer} from 'react-admin'

import {Post} from '@/components/Posts/Post'
import {colors} from '@/theme/colors'
import {theme} from '@/theme/theme'

export const PostPreview: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <FormDataConsumer>
        {({formData}) => (
          <Grid container columnSpacing={5} sx={{width: '100%'}}>
            <Grid size={{xs: 12, md: 4}}>
              <Stack gap={5} sx={{color: colors.black, background: colors.white, p: '10px'}}>
                <Post
                  id={0}
                  links={formData?.links ?? []}
                  caption={formData?.caption ?? ''}
                  short_text={formData?.short_text ?? ''}
                  details={formData?.details ?? ''}
                  added_at={formData?.added_at ?? new Date().toISOString()}
                  visible_after={formData?.visible_after ?? ''}
                  visible_until={formData?.visible_until ?? ''}
                  sites={formData?.sites ?? []}
                />
              </Stack>
            </Grid>
          </Grid>
        )}
      </FormDataConsumer>
    </ThemeProvider>
  )
}
