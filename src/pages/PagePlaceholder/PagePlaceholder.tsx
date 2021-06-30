// import './PagePlaceholder.css'
import {FC} from 'react'

export const PagePlaceholder: FC<{title: string}> = ({title}) => {
  return (
    <div className="placeholder">
      <h1>{title}</h1>
    </div>
  )
}
