import {Stack} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {FC, useState} from 'react'
import {FormDataConsumer, ThemeProvider} from 'react-admin'

import {Post} from '@/components/Posts/Post'
import {PostDetail} from '@/components/Posts/PostDetail'
import {theme} from '@/theme'

export const PostPreview: FC = () => {
  const [isDetailOpen, openDetail] = useState<boolean>(false)
  return (
    <ThemeProvider theme={theme}>
      <FormDataConsumer>
        {({formData}) => (
          <Grid container>
            <Grid xs={6}>
              <Stack gap={5}>
                <Post
                  id={0}
                  links={formData?.links ?? []}
                  caption={formData?.caption ?? ''}
                  short_text={formData?.short_text ?? ''}
                  details={formData?.details ?? ''}
                  added_at={formData?.added_at ?? ''}
                  visible_after={formData?.visible_after ?? ''}
                  visible_until={formData?.visible_until ?? ''}
                  sites={formData?.sites ?? []}
                  openDetail={() => openDetail(true)}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              {isDetailOpen && <PostDetail caption={formData?.caption ?? ''} details={formData?.details ?? ''} />}
            </Grid>
          </Grid>
        )}
      </FormDataConsumer>
    </ThemeProvider>
  )
}
