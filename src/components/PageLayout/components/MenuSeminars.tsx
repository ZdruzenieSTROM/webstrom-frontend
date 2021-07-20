// import './MenuSeminars.css'
import Link from 'next/link'
import {FC} from 'react'

export const MenuSeminars: FC<{seminarId: number}> = ({seminarId}) => {
  return (
    <div id="menu-seminars">
      <div className={seminarId === 3 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link href="/malynar">
          <a>Malynár</a>
        </Link>
      </div>
      <div className={seminarId === 2 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link href="/matik">
          <a>Matik</a>
        </Link>
      </div>
      <div className={seminarId === 1 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link href="/strom">
          <a>Strom</a>
        </Link>
      </div>
      <div className={seminarId === 4 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link href="/zdruzenie">
          <a>Združenie</a>
        </Link>
      </div>
    </div>
  )
}
