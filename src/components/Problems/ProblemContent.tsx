import {Stack, Typography} from '@mui/material'
import Image from 'next/image'
import {FC} from 'react'

import {Markdown} from '../Markdown/Markdown'

type ProblemContentProps = {
  order: number | string
  text: string
  image?: string | null
}

export const ProblemContent: FC<ProblemContentProps> = ({order, text, image}) => (
  <>
    <Typography variant="h3">{order}. ÚLOHA</Typography>
    <Markdown content={text} />
    {image && (
      <Stack alignItems="center">
        <Image
          src={image}
          alt={`Obrázok - ${order} úloha`}
          style={{
            width: 'auto',
            height: 'auto',
            minHeight: '3rem',
            minWidth: '3rem',
            maxHeight: '50vh',
            marginTop: '1rem',
          }}
          // width/height dava len nieco vediet nextu, ale realne sa to styluje stylmi vyssie
          width={800}
          height={800}
        />
      </Stack>
    )}
  </>
)
