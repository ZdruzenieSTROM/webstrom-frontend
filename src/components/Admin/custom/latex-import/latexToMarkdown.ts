import katex from 'katex'

import {katexMacros} from '@/components/Markdown/katexMacros'

// Converts the LaTeX of one problem statement, as the seminars write it in Overleaf, into the Markdown
// the site renders (react-markdown + remark-math + KaTeX). Math is kept as written, because KaTeX
// renders it; only the text around it is translated. Anything the converter does not know is left
// in place and reported, so the editor fixes it in the preview instead of it silently disappearing.

export type ConversionResult = {markdown: string; warnings: string[]}

type Stop = {brace?: boolean; endEnv?: string; item?: boolean}

const MATH_ENVS = new Set([
  'align',
  'align*',
  'equation',
  'equation*',
  'gather',
  'gather*',
  'multline',
  'multline*',
  'eqnarray',
  'eqnarray*',
])

// layout-only commands with no counterpart in Markdown
const DROPPED = new Set([
  'linebreak',
  'nolinebreak',
  'newpage',
  'clearpage',
  'pagebreak',
  'noindent',
  'indent',
  'smallskip',
  'medskip',
  'bigskip',
  'vfill',
  'hfill',
  'centering',
  'raggedright',
  'raggedleft',
  'small',
  'footnotesize',
  'large',
  'Large',
  'normalsize',
])
const DROPPED_WITH_ARG = new Set(['vspace', 'hspace', 'label', 'color'])
const DOTS = new Set(['dots', 'ldots', 'dotsc', 'dotsb', 'textellipsis'])
const ITALIC = new Set(['textit', 'emph', 'textsl'])
const PLAIN = new Set(['text', 'textrm', 'textnormal', 'textup', 'mbox', 'underline'])
const ITALIC_SWITCH = new Set(['it', 'em', 'sl', 'itshape', 'slshape'])
const BOLD_SWITCH = new Set(['bf', 'bfseries'])

const SYMBOLS: Record<string, string> = {
  '-': '',
  ',': ' ',
  ' ': ' ',
  ';': ' ',
  ':': ' ',
  '!': '',
  '/': '',
  '%': '%',
  '&': '&',
  '#': '#',
  '{': '{',
  '}': '}',
  // escaped so remark-math does not open inline math on it
  $: String.raw`\$`,
  _: String.raw`\_`,
}

const NBSP = '\u00A0'
// a backslash at the end of a line is a Markdown hard line break
const HARD_BREAK = '\\\n'
// …except at the end of a paragraph or of the text, where Markdown prints the backslash
const TRAILING_BREAK = /\\\n(?=\n|\s*$)/g

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']

class Converter {
  private pos = 0
  readonly warnings: string[] = []

  constructor(private readonly src: string) {}

  convert(): string {
    const out = this.parse({})
    return (
      out
        .replaceAll(/[\t ]+\n/g, '\n')
        .replaceAll(TRAILING_BREAK, '\n')
        // dropped layout commands leave doubled spaces; leading ones are list indentation
        .replaceAll(/(?<=\S) {2,}/g, ' ')
        .replaceAll(/\n{3,}/g, '\n\n')
        .trim()
    )
  }

  private warn(message: string) {
    if (!this.warnings.includes(message)) this.warnings.push(message)
  }

  private peek(offset = 0) {
    return this.src[this.pos + offset]
  }

  private startsWith(s: string) {
    return this.src.startsWith(s, this.pos)
  }

  private parse(stop: Stop): string {
    let out = ''
    while (this.pos < this.src.length) {
      const c = this.peek()

      if (c === '}') {
        this.pos++
        if (stop.brace) return out
        continue
      }
      if (c === '%') {
        this.skipComment()
        continue
      }
      if (isSpace(c)) {
        out += this.readWhitespace()
        continue
      }
      if (c === '$') {
        out += this.readDollarMath()
        continue
      }
      if (c === '{') {
        this.pos++
        out += this.readGroup()
        continue
      }
      if (c === '~') {
        this.pos++
        out += NBSP
        continue
      }
      if (this.startsWith('``')) {
        this.pos += 2
        out += '„'
        continue
      }
      if (this.startsWith("''")) {
        this.pos += 2
        out += '“'
        continue
      }
      if (this.startsWith('---')) {
        this.pos += 3
        out += '—'
        continue
      }
      if (this.startsWith('--')) {
        this.pos += 2
        out += '–'
        continue
      }
      if (c === '*') {
        this.pos++
        out += String.raw`\*`
        continue
      }
      if (c === '\\') {
        if (stop.item && this.startsWith(String.raw`\item`) && !/[A-Za-z]/.test(this.peek(5) ?? '')) return out
        if (this.startsWith(String.raw`\end{`)) {
          const env = this.readEnd()
          if (env === stop.endEnv) return out
          this.warn(String.raw`\end{${env}} nemá zodpovedajúci \begin – skontroluj vstup.`)
          continue
        }
        out += this.readCommand()
        continue
      }

      this.pos++
      out += c
    }
    if (stop.endEnv) this.warn(String.raw`Chýba \end{${stop.endEnv}}.`)
    return out
  }

  private skipComment() {
    // like TeX, a comment also swallows its line break and the next line's indentation
    while (this.pos < this.src.length && this.peek() !== '\n') this.pos++
    this.pos++
    while (this.peek() === ' ' || this.peek() === '\t') this.pos++
  }

  private readWhitespace(): string {
    let newlines = 0
    while (this.pos < this.src.length && isSpace(this.peek())) {
      if (this.peek() === '\n') newlines++
      this.pos++
    }
    if (newlines >= 2) return '\n\n'
    return newlines === 1 ? '\n' : ' '
  }

  private readUntil(close: string): string {
    const end = this.src.indexOf(close, this.pos)
    if (end === -1) {
      this.warn(`Chýba ukončenie ${close} pre vzorec.`)
      const rest = this.src.slice(this.pos)
      this.pos = this.src.length
      return rest
    }
    const body = this.src.slice(this.pos, end)
    this.pos = end + close.length
    return body
  }

  private readInlineDollar(): string {
    let i = this.pos
    while (i < this.src.length && this.src[i] !== '$') i += this.src[i] === '\\' ? 2 : 1
    const body = this.src.slice(this.pos, i)
    if (i >= this.src.length) this.warn('Chýba ukončenie $ pre vzorec.')
    this.pos = i + 1
    return body
  }

  private readDollarMath(): string {
    if (this.startsWith('$$')) {
      this.pos += 2
      return this.displayMath(this.readUntil('$$'))
    }
    this.pos++
    return this.inlineMath(this.readInlineDollar(), '$', '$')
  }

  private inlineMath(body: string, open: string, close: string): string {
    this.checkMath(body, false)
    return `${open}${body}${close}`
  }

  private displayMath(body: string): string {
    const trimmed = body.trim()
    this.checkMath(trimmed, true)
    return `\n\n$$\n${trimmed}\n$$\n\n`
  }

  private checkMath(tex: string, displayMode: boolean) {
    try {
      katex.renderToString(tex, {displayMode, throwOnError: true, macros: {...katexMacros}})
    } catch (error) {
      const reason = error instanceof Error ? error.message.replace(/^KaTeX parse error: /, '') : String(error)
      this.warn(`Vzorec „${tex}“ sa na stránke nevykreslí: ${reason}`)
    }
  }

  private readGroup(): string {
    const save = this.pos
    while (this.peek() === ' ') this.pos++
    if (this.peek() === '\\') {
      const name = /^\\([A-Za-z]+)/.exec(this.src.slice(this.pos))?.[1]
      if (name && (ITALIC_SWITCH.has(name) || BOLD_SWITCH.has(name))) {
        this.pos += name.length + 1
        const inner = this.parse({brace: true})
        return emphasis(inner, ITALIC_SWITCH.has(name) ? '*' : '**')
      }
    }
    this.pos = save
    return this.parse({brace: true})
  }

  private skipSpaces() {
    while (isSpace(this.peek())) this.pos++
  }

  // raw source of one {…} argument; the caller decides whether to convert it
  private readRawArg(): string | undefined {
    const save = this.pos
    this.skipSpaces()
    if (this.peek() !== '{') {
      this.pos = save
      return undefined
    }
    const start = this.pos + 1
    let depth = 0
    for (; this.pos < this.src.length; this.pos++) {
      const ch = this.peek()
      if (ch === '\\') {
        this.pos++
      } else if (ch === '{') {
        depth++
      } else if (ch === '}' && --depth === 0) {
        this.pos++
        return this.src.slice(start, this.pos - 1)
      }
    }
    this.warn('Chýba uzatváracia zátvorka }.')
    return this.src.slice(start)
  }

  private readOptionalArg(): string | undefined {
    const save = this.pos
    this.skipSpaces()
    if (this.peek() !== '[') {
      this.pos = save
      return undefined
    }
    const end = this.src.indexOf(']', this.pos)
    if (end === -1) {
      this.pos = save
      return undefined
    }
    const value = this.src.slice(this.pos + 1, end)
    this.pos = end + 1
    return value
  }

  private convertArg(): string {
    const raw = this.readRawArg()
    if (raw === undefined) return ''
    const inner = new Converter(raw)
    const out = inner.parse({})
    for (const w of inner.warnings) this.warn(w)
    return out
  }

  private readEnd(): string {
    this.pos += String.raw`\end`.length
    return this.readRawArg() ?? ''
  }

  private readCommand(): string {
    const start = this.pos
    this.pos++
    const next = this.peek()
    if (next === '(') {
      this.pos++
      return this.inlineMath(this.readUntil(String.raw`\)`), String.raw`\(`, String.raw`\)`)
    }
    if (next === '[') {
      this.pos++
      return this.displayMath(this.readUntil(String.raw`\]`))
    }
    if (next === undefined) {
      this.warn(String.raw`Osamotené \ na konci textu som nechal bez zmeny.`)
      return '\\'
    }
    if (next === '\\') {
      this.pos++
      return this.lineBreak()
    }
    if (!/[A-Za-z]/.test(next)) {
      this.pos++
      if (next in SYMBOLS) return SYMBOLS[next]
      this.warn(`Neznámy príkaz \\${next} som nechal bez zmeny.`)
      return `\\${next}`
    }

    const name = /^[A-Za-z]+/.exec(this.src.slice(this.pos))![0]
    this.pos += name.length

    if (name === 'begin') return this.readEnvironment()
    if (ITALIC.has(name)) return emphasis(this.convertArg(), '*')
    if (name === 'textbf') return emphasis(this.convertArg(), '**')
    if (name === 'uv') return `„${this.convertArg()}“`
    if (PLAIN.has(name)) return this.convertArg()
    if (DOTS.has(name)) return '…'
    if (name === 'textdegree') return '°'
    if (name === 'par') return '\n\n'
    if (name === 'newline') return this.lineBreak()
    if (DROPPED.has(name)) return ''
    if (DROPPED_WITH_ARG.has(name)) {
      if (this.peek() === '*') this.pos++
      this.readRawArg()
      return ''
    }
    if (name === 'includegraphics') {
      this.readOptionalArg()
      const file = this.readRawArg() ?? ''
      this.warn(`Obrázok ${file} sa do textu neprenáša – nahraj ho do poľa Obrázok.`)
      return ''
    }
    if (name === 'item') {
      this.warn(String.raw`\item mimo zoznamu som vynechal.`)
      return ''
    }

    // keep an unknown command with its arguments untouched, so nothing is lost
    this.readOptionalArg()
    while (this.readRawArg() !== undefined);
    this.warn(`Neznámy príkaz \\${name} som nechal bez zmeny – uprav ho ručne.`)
    return this.src.slice(start, this.pos)
  }

  // `\\`, `\\[2mm]`, `\\*` and `\newline`
  private lineBreak(): string {
    if (this.peek() === '*') this.pos++
    this.readOptionalArg()
    const whitespace = isSpace(this.peek()) ? this.readWhitespace() : ''
    return whitespace === '\n\n' ? whitespace : HARD_BREAK
  }

  private readEnvironment(): string {
    const start = this.pos - String.raw`\begin`.length
    const env = this.readRawArg() ?? ''

    if (env === 'itemize' || env === 'enumerate') {
      const options = this.readOptionalArg()
      return `\n\n${this.readList(env, options)}\n\n`
    }
    if (env === 'center' || env === 'figure' || env === 'flushleft' || env === 'flushright') {
      this.readOptionalArg()
      return `\n\n${this.parse({endEnv: env})}\n\n`
    }

    const body = this.readRawEnvBody(env)
    if (MATH_ENVS.has(env)) return this.displayMath(String.raw`\begin{${env}}${body}\end{${env}}`)
    this.warn(`Prostredie ${env} sa nedá previesť – uprav ho ručne.`)
    return `\n\n${this.src.slice(start, this.pos)}\n\n`
  }

  private readRawEnvBody(env: string): string {
    const begin = String.raw`\begin{${env}}`
    const end = String.raw`\end{${env}}`
    const bodyStart = this.pos
    let depth = 1
    while (this.pos < this.src.length) {
      if (this.startsWith(begin)) {
        depth++
        this.pos += begin.length
      } else if (this.startsWith(end)) {
        if (--depth === 0) {
          const body = this.src.slice(bodyStart, this.pos)
          this.pos += end.length
          return body
        }
        this.pos += end.length
      } else {
        this.pos++
      }
    }
    this.warn(String.raw`Chýba \end{${env}}.`)
    return this.src.slice(bodyStart)
  }

  private readList(env: 'itemize' | 'enumerate', options: string | undefined): string {
    const entries: {label?: string; content: string}[] = []

    // anything before the first \item is not part of an item
    this.parse({endEnv: env, item: true})
    while (this.startsWith(String.raw`\item`)) {
      this.pos += String.raw`\item`.length
      const label = this.readOptionalArg()
      const content = this.parse({endEnv: env, item: true}).replaceAll(TRAILING_BREAK, '').trim()
      entries.push({label, content})
    }

    const labelFormat = env === 'enumerate' ? letterLabel(options) : undefined
    const letters = labelFormat && entries.map((_, index) => labelFormat(index))
    // Markdown has no lettered lists; such items become paragraphs starting with their label
    if (letters?.every((letter) => letter !== undefined)) {
      return entries.map(({content}, index) => `${letters[index]} ${content}`).join('\n\n')
    }

    return entries
      .map(({label, content}, index) => {
        const marker = env === 'itemize' || label !== undefined ? '-' : `${index + 1}.`
        // continuation lines must be indented past the marker to stay inside the item
        const indent = ' '.repeat(marker.length + 1)
        const text = label === undefined ? content : `${label} ${content}`
        return `${marker} ${text.replaceAll('\n', `\n${indent}`)}`
      })
      .join('\n')
  }
}

// NBSP and other Unicode spaces are content, not TeX whitespace
const isSpace = (c: string | undefined) => c === ' ' || c === '\t' || c === '\n' || c === '\r'

const emphasis = (inner: string, mark: string) => {
  // a break left before the closing mark would escape it and the site would show the marks literally
  const trimmed = inner.replaceAll(TRAILING_BREAK, '').trim()
  if (!trimmed) return inner
  const lead = inner.startsWith(' ') ? ' ' : ''
  const trail = inner.endsWith(' ') ? ' ' : ''
  return `${lead}${mark}${trimmed}${mark}${trail}`
}

// enumitem labels like `\alph*.` or `(\roman*)`; plain numbering stays a Markdown ordered list.
// An index past the counter's range gives undefined, and the list falls back to plain numbering.
const letterLabel = (options: string | undefined): ((index: number) => string | undefined) | undefined => {
  const label = /label\s*=\s*{?([^,\]}]*)/.exec(options ?? '')?.[1]?.trim()
  if (!label) return undefined
  const counters: Record<string, (i: number) => string | undefined> = {
    '\\alph*': (i) => ALPHA[i],
    '\\Alph*': (i) => ALPHA[i]?.toUpperCase(),
    '\\roman*': (i) => ROMAN[i],
    '\\Roman*': (i) => ROMAN[i]?.toUpperCase(),
  }
  const counter = Object.keys(counters).find((c) => label.includes(c))
  if (!counter) return undefined
  return (index) => {
    const value = counters[counter](index)
    return value === undefined ? undefined : label.replace(counter, value)
  }
}

export const latexToMarkdown = (tex: string): ConversionResult => {
  const converter = new Converter(tex.replaceAll('\r\n', '\n'))
  const markdown = converter.convert()
  return {markdown, warnings: converter.warnings}
}
