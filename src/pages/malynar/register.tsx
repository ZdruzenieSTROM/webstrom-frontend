import {NextPage} from 'next'

import {PageLayout} from '../../components/PageLayout/PageLayout'
import {RegisterForm} from '../../components/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout seminarId={3}>
    <RegisterForm />
  </PageLayout>
)

export default Register
