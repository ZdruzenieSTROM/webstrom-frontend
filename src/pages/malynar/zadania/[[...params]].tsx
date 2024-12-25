import {NextPage} from 'next'

import Page, {getServerSideProps} from '../../strom/zadania/[[...params]]'

const Zadania: NextPage = () => {
  return <Page />
}

export default Zadania

export {getServerSideProps}
