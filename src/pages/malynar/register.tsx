import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {RegisterForm} from '@/components/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout>
    <RegisterForm />
  </PageLayout>
)

export default Register
