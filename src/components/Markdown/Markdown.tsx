import 'katex/dist/katex.min.css'

import {Box} from '@mui/material'
import {FC} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import {firaMath} from '@/theme/font'

import {H1, H2, H3, MarkdownLink, Ol, P, Table, Td, Th, Ul} from './Texts'

type MarkdownProps = {
  // optional pre istotu - mali sme problem vo flat page administracii, tak nech sa fallback poriesi tu
  content?: string
}

const Empty: FC = () => <></>

const clean = (value: string) =>
  value.replaceAll(/\\\((.+?)\\\)/gs, (_, expr) => `$${expr}$`).replaceAll(/\\\[(.+?)\\]/gs, (_, expr) => `$$${expr}$$`)

export const Markdown: FC<MarkdownProps> = ({content}) => {
  const cleanContent = content ? clean(content) : ''

  return (
    <Box
      sx={{
        '& .katex *': {
          fontFamily: `${firaMath.style.fontFamily}, KaTeX_Main, Times New Roman, serif !important`,
        },
        '.katex': {
          // default .katex styl je `1.21em / 1.2 KaTeX_Main, Times New Roman, serif`, takze nastavuje napr. zbytocne velky font size
          font: 'inherit',
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, {output: 'html'}]]}
        components={{
          a: MarkdownLink,
          table: Table,
          th: Th,
          td: Td,
          p: P,
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H3,
          h5: H3,
          h6: H3,
          ol: Ol,
          ul: Ul,
          script: Empty,
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </Box>
  )
}
