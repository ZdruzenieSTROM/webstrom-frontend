// import './Footer.css'
import {FC} from 'react'
import {useCookies} from 'react-cookie'

export const Footer: FC = () => {
  const [cookies] = useCookies(['webstrom-token', 'webstrom-name'])

  return (
    <div id="footer">
      <div>
        {/* webstrom-name a webstrom-token sa v budúcnosti nebudú vypisovať. Zatiaľ tu sú na debugovanie. */}
        <span> webstrom-name: {cookies['webstrom-name']} </span>
        <span> webstrom-token: {cookies['webstrom-token']} </span>
      </div>
    </div>
  )
}
