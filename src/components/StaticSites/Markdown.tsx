import {FC} from 'react'
import ReactMarkdown from 'react-markdown'

import {H1, H2, H3, H4, H5, H6} from './Texts'

type MarkdownProps = {
  content: string
}

export const Markdown: FC<MarkdownProps> = ({content}) => (
  <ReactMarkdown
    components={{
      h1: H1,
      h2: H2,
      h3: H3,
      h4: H4,
      h5: H5,
      h6: H6,
    }}
  >
    {content}
  </ReactMarkdown>
)
