import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {RegisterForm} from '@/components/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout contentWidth={1} title="Registrácia">
    <RegisterForm />
  </PageLayout>
)

export default Register
