import './Latex.css'

import {MathComponent} from 'mathjax-react'
import React from 'react'

let re = /((?<!(\\|\$))\$(?!\$).+?(?<!(\\|\$))\$(?!\$))|(\$\$.+?\$\$)|(\\\[.+?\\\])|(\\\(.+?\\\))/gs

let trim = (str: string) => {
  if (str[0] === '$' && str[1] !== '$') {
    return str.substring(1, str.length - 1)
  } else {
    return str.substring(2, str.length - 2)
  }
}

export const Latex: React.FC<{children: any}> = ({children}) => {
  let matches: any = Array.from(children.matchAll(re))

  if (matches.length === 0) {
    return <>{children}</>
  }

  let result = []
  let currentPosition: number = 0

  for (let m in matches) {
    result.push(<>{children.substring(currentPosition, matches[m].index)}</>)
    if (matches[m][0].substring(0, 2) === '\\[' || matches[m][0].substring(0, 2) === '$$') {
      result.push(
        <>
          <MathComponent tex={trim(matches[m][0])} display={true} />
        </>,
      )
    } else {
      result.push(
        <>
          <MathComponent tex={trim(matches[m][0])} display={false} />
        </>,
      )
    }

    currentPosition = matches[m].index + matches[m][0].length
  }

  result.push(<span>{children.substring(currentPosition)}</span>)

  return <div>{result}</div>
}
