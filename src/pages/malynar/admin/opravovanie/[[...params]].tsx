import {NextPage} from 'next'

import Page, {getServerSideProps} from '../../../strom/admin/opravovanie/[[...params]]'

const SemesterAdmnistration: NextPage = () => {
  return <Page />
}

export default SemesterAdmnistration

export {getServerSideProps}
