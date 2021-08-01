import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {RegisterForm} from '../../src/components/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout seminarId={1}>
    <RegisterForm />
  </PageLayout>
)

export default Register