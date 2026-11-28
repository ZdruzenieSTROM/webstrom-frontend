import {describe, expect, it} from 'vitest'

import {latexToMarkdown} from './latexToMarkdown'

// STROM 51, winter semester, series 1 – problem bodies as written in Overleaf
const problem1 = String.raw`
V trojuholníku \(ABC\) os uhla \(ABC\) pretína \(AC\) v bode \(D\). Rovnobežka s \(BC\) vedená bodom \(D\) pretína \(AB\) v bode \(E\). Platí, že strany \(AB\) a \(BC\) sú v pomere \(2:1\). V akom pomere delí \(E\) úsečku \(AB\)?
`
const problem3 = String.raw`
\textit{Obec} je súvislý útvar zložený zo štvorcov rovnakej veľkosti, ktoré navzájom susedia hranou. Na obrázku pod úlohou je uvedené, ako by napríklad mohla vyzerať \textit{obec} zložená z ôsmich štvorcov.

\textit{Mestom} nazveme takú \textit{obec}, ktorá sa skladá z aspoň \(2026\) štvorcov. \textit{Nedeliteľné mesto} je také, ktoré sa nedá rozdeliť na dve alebo viacero \textit{miest}. Aký je maximálny počet štvorcov, z ktorých sa môže skladať \textit{nedeliteľné mesto}?

\begin{center}
    \includegraphics[scale=0.6]{obr/4-3.PNG}
\end{center}

`
const problem5 = String.raw`
Na tabuli je napísaných \(n\) núl v jednom riadku. Hráme hru. V každom ťahu zotrieme jednu z cifier na tabuli a nahradíme ju inou cifrou na tom istom mieste. Dodržiavame pritom tieto obmedzenia:
\begin{itemize}
    \item Píšeme iba cifry \(0\), \(1\) a \(2\).
    \item Rozdiel napísanej a zotretej cifry musí byť \(1\).
    \item Cifru nemožno zotrieť, ak sa niekde napravo od nej nachádza rovnaká cifra.
    \item Nemožno napísať takú cifru, ktorá sa už nachádza niekde napravo od práve zotretej cifry.
\end{itemize}
Určte, na koľko najmenej ťahov môžeme dosiahnuť stav, že na tabuli budú napísané samé jednotky.
`
const problem6 = String.raw`
Nájdite všetky funkcie \(f: \mathbb{Z}\rightarrow\mathbb{Z}\) také, že pre všetky \(a,b\in\mathbb{Z}\) platí:
\[f(a+b)+f(ab-1)=f(a)f(b)+2.\]
`

describe(latexToMarkdown, () => {
  it('should keep inline math as written and convert nothing in plain text', () => {
    expect(latexToMarkdown(problem1)).toStrictEqual({
      markdown: String.raw`V trojuholníku \(ABC\) os uhla \(ABC\) pretína \(AC\) v bode \(D\). Rovnobežka s \(BC\) vedená bodom \(D\) pretína \(AB\) v bode \(E\). Platí, že strany \(AB\) a \(BC\) sú v pomere \(2:1\). V akom pomere delí \(E\) úsečku \(AB\)?`,
      warnings: [],
    })
  })

  it(String.raw`should turn \textit into emphasis, keep paragraphs and drop the figure with a warning`, () => {
    const {markdown, warnings} = latexToMarkdown(problem3)

    expect(markdown)
      .toBe(String.raw`*Obec* je súvislý útvar zložený zo štvorcov rovnakej veľkosti, ktoré navzájom susedia hranou. Na obrázku pod úlohou je uvedené, ako by napríklad mohla vyzerať *obec* zložená z ôsmich štvorcov.

*Mestom* nazveme takú *obec*, ktorá sa skladá z aspoň \(2026\) štvorcov. *Nedeliteľné mesto* je také, ktoré sa nedá rozdeliť na dve alebo viacero *miest*. Aký je maximálny počet štvorcov, z ktorých sa môže skladať *nedeliteľné mesto*?`)
    expect(warnings).toStrictEqual(['Obrázok obr/4-3.PNG sa do textu neprenáša – nahraj ho do poľa Obrázok.'])
  })

  it('should turn itemize into a Markdown list without the source indentation', () => {
    expect(latexToMarkdown(problem5).markdown)
      .toBe(String.raw`Na tabuli je napísaných \(n\) núl v jednom riadku. Hráme hru. V každom ťahu zotrieme jednu z cifier na tabuli a nahradíme ju inou cifrou na tom istom mieste. Dodržiavame pritom tieto obmedzenia:

- Píšeme iba cifry \(0\), \(1\) a \(2\).
- Rozdiel napísanej a zotretej cifry musí byť \(1\).
- Cifru nemožno zotrieť, ak sa niekde napravo od nej nachádza rovnaká cifra.
- Nemožno napísať takú cifru, ktorá sa už nachádza niekde napravo od práve zotretej cifry.

Určte, na koľko najmenej ťahov môžeme dosiahnuť stav, že na tabuli budú napísané samé jednotky.`)
  })

  it('should put display math on its own lines between $$', () => {
    expect(latexToMarkdown(problem6).markdown)
      .toBe(String.raw`Nájdite všetky funkcie \(f: \mathbb{Z}\rightarrow\mathbb{Z}\) také, že pre všetky \(a,b\in\mathbb{Z}\) platí:

$$
f(a+b)+f(ab-1)=f(a)f(b)+2.
$$`)
  })

  it('should keep siunitx macros in math, since the site defines them for KaTeX, and turn ~ into a non-breaking space', () => {
    // STROM 51, winter semester, series 2, problem 6 (shortened)
    const tex = String.raw`Nech $ABC$ je trojuholník s $|\angle BAC |=\ang{120} $. Dotykové body označme $P$ a~$Q$.`

    expect(latexToMarkdown(tex)).toStrictEqual({
      markdown:
        String.raw`Nech $ABC$ je trojuholník s $|\angle BAC |=\ang{120} $. Dotykové body označme $P$ a` + '\u00A0$Q$.',
      warnings: [],
    })
  })

  it(String.raw`should replace \uv with Slovak quotes inside list items`, () => {
    // STROM 51, summer semester, series 1, problem 1 (shortened)
    const tex = String.raw`Zaradom vyslovili tieto pravdivé výroky:
\begin{itemize}
    \item Amur: \uv{Neviem, aký je súčet našich čísel.}
    \item Bofur: \uv{Už viem, aký je súčet našich čísel.}
\end{itemize}`

    expect(latexToMarkdown(tex).markdown).toBe(`Zaradom vyslovili tieto pravdivé výroky:

- Amur: „Neviem, aký je súčet našich čísel.“
- Bofur: „Už viem, aký je súčet našich čísel.“`)
  })

  it('should write lettered enumerate items as paragraphs starting with their label', () => {
    // STROM 49, series 2 – Markdown has no lettered lists
    const tex = String.raw`Pre všetky kladné celé \(k\) platí \(a_{a_k} = 3k\).
\begin{enumerate}[label=\alph*.]
    \item Určte \(a_{1000}\).
    \item Určte \(a_{2024}\).
\end{enumerate}`

    expect(latexToMarkdown(tex).markdown).toBe(String.raw`Pre všetky kladné celé \(k\) platí \(a_{a_k} = 3k\).

a. Určte \(a_{1000}\).

b. Určte \(a_{2024}\).`)
  })

  it('should number plain enumerate and indent a nested list under its item', () => {
    const tex = String.raw`\begin{enumerate}
\item Prvá podmienka:
\begin{itemize}
\item vnorená
\end{itemize}
\item Druhá podmienka.
\end{enumerate}`

    expect(latexToMarkdown(tex).markdown).toBe(`1. Prvá podmienka:

   - vnorená
2. Druhá podmienka.`)
  })

  it('should drop comments, soft hyphens and line breaks', () => {
    // STROM 50, winter semester, series 1, problem 3 (shortened)
    const tex = String.raw`%Stará verzia zadania.
Dokážte, že existuje konečná pos\-tup\-nosť seknutí, pomocou ktorých Herkules odsekne všetky hlavy \linebreak a tento postup popíšte.`

    expect(latexToMarkdown(tex)).toStrictEqual({
      markdown:
        'Dokážte, že existuje konečná postupnosť seknutí, pomocou ktorých Herkules odsekne všetky hlavy a tento postup popíšte.',
      warnings: [],
    })
  })

  it('should keep an unknown command and environment as written and report them', () => {
    const tex = String.raw`Pozri \cite{knuth} a tabuľku:
\begin{tabular}{cc}
1 & 2
\end{tabular}`

    const {markdown, warnings} = latexToMarkdown(tex)

    expect(markdown).toBe(String.raw`Pozri \cite{knuth} a tabuľku:

\begin{tabular}{cc}
1 & 2
\end{tabular}`)
    expect(warnings).toStrictEqual([
      String.raw`Neznámy príkaz \cite som nechal bez zmeny – uprav ho ručne.`,
      'Prostredie tabular sa nedá previesť – uprav ho ručne.',
    ])
  })

  it('should report math that KaTeX cannot render', () => {
    const {warnings} = latexToMarkdown(String.raw`Platí \(x \foo y\).`)

    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toMatch(/^Vzorec „x \\foo y“ sa na stránke nevykreslí: Undefined control sequence: \\foo/)
  })

  it('should convert bold, dashes and TeX quotes in text', () => {
    expect(latexToMarkdown("\\textbf{Pozor} -- platí ``vždy''.").markdown).toBe('**Pozor** – platí „vždy“.')
  })

  it('should keep a lone backslash at the end with a warning instead of failing', () => {
    // what the text looks like while someone is typing a command
    expect(latexToMarkdown('Plocha je \\')).toStrictEqual({
      markdown: 'Plocha je \\',
      warnings: [String.raw`Osamotené \ na konci textu som nechal bez zmeny.`],
    })
  })

  it(String.raw`should turn \\ into a Markdown hard line break, but not at the end of a paragraph`, () => {
    const tex = String.raw`Prvý riadok\\
druhý riadok\newline tretí.\\

Nový odsek.\\`

    expect(latexToMarkdown(tex).markdown).toBe('Prvý riadok\\\ndruhý riadok\\\ntretí.\n\nNový odsek.')
  })

  it('should fall back to a numbered list when a lettered list runs past z', () => {
    const items = Array.from({length: 27}, (_, i) => String.raw`\item p${i + 1}`).join('\n')
    const {markdown} = latexToMarkdown(
      String.raw`\begin{enumerate}[label=\alph*)]` + `\n${items}\n` + String.raw`\end{enumerate}`,
    )

    expect(markdown.split('\n')[0]).toBe('1. p1')
    expect(markdown.split('\n')[26]).toBe('27. p27')
  })
})
