import 'katex/dist/katex.min.css'

import {FC} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import {Header, MarkdownLink, Ol, Paragraph, Ul} from './PostMarkdownTexts'

type PostMarkdownProps = {
  content: string
}

export const PostMarkdown: FC<PostMarkdownProps> = ({content}) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{
      a: MarkdownLink,
      p: Paragraph,
      h1: Header,
      h2: Header,
      h3: Header,
      h4: Header,
      h5: Header,
      h6: Header,
      ol: Ol,
      ul: Ul,
    }}
    disallowedElements={['table']}
  >
    {content}
  </ReactMarkdown>
)
