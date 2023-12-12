import 'katex/dist/katex.min.css'

import {FC} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import {H1, H2, H3, MarkdownLink, Ol, P, Table, Td, Th, Ul} from './Texts'

type MarkdownProps = {
  content: string
}

export const Markdown: FC<MarkdownProps> = ({content}) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeKatex]}
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
    }}
  >
    {content}
  </ReactMarkdown>
)
