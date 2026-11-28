import type {Nodes} from 'mdast'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import {unified} from 'unified'

// TeX delimiters \( \) and \[ \] -> $ and $$, so remark-math understands them
export const cleanPostMarkdown = (value: string) => value.replaceAll(/\\\(|\\\)/g, '$').replaceAll(/\\\[|\\]/g, '$$')

// rovnake remark pluginy ako v PostMarkdown, aby detekcia sedela s tym, co sa naozaj vyrenderuje ako odkaz
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath)

const collectLinks = (node: Nodes, acc: string[]) => {
  if (node.type === 'link') acc.push(node.url)
  if ('children' in node) for (const child of node.children) collectLinks(child, acc)
}

/** Returns URLs of all links (Markdown `[a](b)`, `<https://…>`, GFM autolinks like `www.…` / `https://…`) in the text. */
export const findMarkdownLinks = (value: string): string[] => {
  if (!value) return []
  const links: string[] = []
  collectLinks(parser.parse(cleanPostMarkdown(value)), links)
  return links
}
