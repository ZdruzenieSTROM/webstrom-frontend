import {NextPage} from 'next'

import Page, {getServerSideProps} from '../../strom/verify-email/[verificationKey]'

const Verify: NextPage = () => {
  return <Page />
}

export default Verify

export {getServerSideProps}
