// import './Latex.css'
import {MathComponentProps} from 'mathjax-react/dist/components/MathComponent'
import dynamic from 'next/dynamic'
import {FC} from 'react'

// mathjax-react musi byt renderovany client-side (spolieha sa na browser `window`): https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const MathComponent = dynamic<MathComponentProps>(
  () => import('mathjax-react').then(({MathComponent}) => MathComponent),
  {ssr: false},
)

// toto je regex, ktory matchuje LaTeX matematiku: $$.$$ \[.\] $.$ \(.\)
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
      children.slice(currentPosition, m.index),
      <MathComponent tex={trim(m[0])} display={m[0].slice(0, 2) === '\\[' || m[0].slice(0, 2) === '$$'} />,
    )

    if (typeof m.index !== 'undefined') {
      currentPosition = m.index + m[0].length
    }
  }

  result.push(children.slice(Math.max(0, currentPosition)))

  return (
    <div>
      {result.map((child, index) => (
        // kazdy element listu potrebuje key, inak mame react warning
        <span key={index}>{child}</span>
      ))}
    </div>
  )
}
