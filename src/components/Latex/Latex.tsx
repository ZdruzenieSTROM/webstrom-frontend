import './Latex.css'

import {MathComponent} from 'mathjax-react'
import React from 'react'

// toto je regex, ktory matchuje LaTeX matematiku: $$.$$ \[.\] $.$ \(.\)
const re = /((?<!(\\|\$))\$(?!\$).+?(?<!(\\|\$))\$(?!\$))|(\$\$.+?\$\$)|(\\\[.+?\\\])|(\\\(.+?\\\))/gs

const trim = (str: string) => {
  if (str[0] === '$' && str[1] !== '$') {
    return str.substring(1, str.length - 1)
  } else {
    return str.substring(2, str.length - 2)
  }
}

export const Latex: React.FC<{children: string}> = ({children}) => {
  const matches = Array.from(children.matchAll(re))

  if (matches.length === 0) {
    return <>{children}</>
  }

  let result = []
  let currentPosition = 0

  for (const m of matches) {
    result.push(<>{children.substring(currentPosition, m.index)}</>)
    result.push(
      <>
        <MathComponent tex={trim(m[0])} display={m[0].substring(0, 2) === '\\[' || m[0].substring(0, 2) === '$$'} />
      </>,
    )

    const p = m.index
    console.log(p)

    if (typeof m.index !== 'undefined') {
      currentPosition = m.index + m[0].length
    }
  }

  result.push(<>{children.substring(currentPosition)}</>)

  return <div>{result}</div>
}
