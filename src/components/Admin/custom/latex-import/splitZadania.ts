// A series file (zadania1.tex, zadania2.tex) defines one macro per problem, named by Roman numerals:
// \newcommand{\zadIIIsI}{…} is problem 3 of series 1.

export type ZadanieTex = {series: number; order: number; tex: string}

const ROMAN_VALUES: Record<string, number> = {I: 1, V: 5, X: 10, L: 50, C: 100}

const fromRoman = (roman: string) => {
  let sum = 0
  for (const [i, char] of [...roman].entries()) {
    const value = ROMAN_VALUES[char]
    sum += value < (ROMAN_VALUES[roman[i + 1]] ?? 0) ? -value : value
  }
  return sum
}

// index of the `}` closing the group whose body starts at `start`; comments are skipped,
// because a commented-out draft may hold unbalanced braces
const findGroupEnd = (src: string, start: number): number | undefined => {
  let depth = 1
  for (let i = start; i < src.length; i++) {
    switch (src[i]) {
      case '\\': {
        i++
        break
      }
      case '%': {
        while (i < src.length && src[i] !== '\n') i++
        break
      }
      case '{': {
        depth++
        break
      }
      case '}': {
        if (--depth === 0) return i
        break
      }
    }
  }
  return undefined
}

export type SplitResult = {
  problems: ZadanieTex[]
  // problems whose body never closes; such a file would not compile in Overleaf either
  unclosed: Omit<ZadanieTex, 'tex'>[]
}

export const splitZadania = (src: string): SplitResult => {
  const definition = /^[^\n%]*?\\(?:(?:re)?newcommand\*?|def)\s*{?\s*\\zad([CILVX]+)s([CILVX]+)\s*}?\s*(?:\[\d])?\s*{/gm
  const problems: ZadanieTex[] = []
  const unclosed: Omit<ZadanieTex, 'tex'>[] = []
  for (const match of src.matchAll(definition)) {
    const order = fromRoman(match[1])
    const series = fromRoman(match[2])
    const bodyStart = match.index + match[0].length
    const bodyEnd = findGroupEnd(src, bodyStart)
    if (bodyEnd === undefined) {
      unclosed.push({series, order})
      continue
    }
    problems.push({order, series, tex: src.slice(bodyStart, bodyEnd).trim()})
  }
  return {problems, unclosed}
}
