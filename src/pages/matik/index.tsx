import {NextPage} from 'next'

import Page, {getServerSideProps} from '../strom/index'

const Home: NextPage = () => {
  return <Page />
}

export default Home

export {getServerSideProps}
