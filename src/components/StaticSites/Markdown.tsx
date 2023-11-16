import 'katex/dist/katex.min.css'

import {FC} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import {MarkdownLink, P, Table, Td, Th} from './Texts'

type MarkdownProps = {
  content: string
}

export const Markdown: FC<MarkdownProps> = ({content}) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{
      th: Th,
      td: Td,
      a: MarkdownLink,
      table: Table,
      p: P,
    }}
  >
    {content}
  </ReactMarkdown>
)
