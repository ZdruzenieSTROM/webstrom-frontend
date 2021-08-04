import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {RegisterForm} from '@/components/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout seminarId={2}>
    <RegisterForm />
  </PageLayout>
)

export default Register
