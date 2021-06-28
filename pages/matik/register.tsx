import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {RegisterForm} from '../../src/pages/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout seminarId={2}>
    <RegisterForm />
  </PageLayout>
)

export default Register
