import {MathComponentProps} from 'mathjax-react/dist/components/MathComponent'
import dynamic from 'next/dynamic'
import {FC, Fragment} from 'react'

import styles from './Latex.module.scss'

// mathjax-react musi byt renderovany client-side (spolieha sa na browser `window`): https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const MathComponent = dynamic<MathComponentProps>(
  () => import('mathjax-react').then(({MathComponent}) => MathComponent),
  {ssr: false},
)

// toto je regex, ktory matchuje LaTeX matematiku: $$.$$ \[.\] $.$ \(.\)
// eslint-disable-next-line security/detect-unsafe-regex
const re = /((?<!(\\|\$))\$(?!\$).+?(?<!(\\|\$))\$(?!\$))|(\$\$.+?\$\$)|(\\\[.+?\\\])|(\\\(.+?\\\))/gsu

const trim = (str: string) => {
  if (str[0] === '$' && str[1] !== '$') {
    return str.slice(1, -1)
  } else {
    return str.slice(2, -2)
  }
}

export const Latex: FC<{children: string}> = ({children}) => {
  const matches = Array.from(children.matchAll(re))

  if (matches.length === 0) {
    return <>{children}</>
  }

  const result = []
  let currentPosition = 0

  for (const m of matches) {
    result.push(
      <span>{children.slice(currentPosition, m.index)}</span>,
      <MathComponent tex={trim(m[0])} display={m[0].slice(0, 2) === '\\[' || m[0].slice(0, 2) === '$$'} />,
    )

    if (typeof m.index !== 'undefined') {
      currentPosition = m.index + m[0].length
    }
  }

  result.push(<span>{children.slice(Math.max(0, currentPosition))}</span>)

  return (
    // nas globalny CSS reset nastavuje SVGcka na display:block, tak to tu resetneme nazad na inline
    // - MathComponent totiz pouziva SVGcka na LaTex vyrazy a rata s tym, ze su inline
    <div className={styles.inlineSvgs}>
      {result.map((child, index) => (
        // kazdy element listu potrebuje key, inak mame react warning
        <Fragment key={index}>{child}</Fragment>
      ))}
    </div>
  )
}
