import {NextPage} from 'next'

import Page, {getServerSideProps} from '../strom/kalendar'

const KalendarPage: NextPage = () => {
  return <Page />
}

export default KalendarPage
export {getServerSideProps}
