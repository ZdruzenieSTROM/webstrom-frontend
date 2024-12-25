import {NextPage} from 'next'

import Page, {getServerSideProps} from '../../strom/vysledky/[[...params]]'

const Vysledky: NextPage = () => {
  return <Page />
}

export default Vysledky

export {getServerSideProps}
