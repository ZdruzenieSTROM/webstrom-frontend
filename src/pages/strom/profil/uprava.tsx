import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProfileForm} from '@/components/Profile/ProfileForm'

const Profil: NextPage = () => (
  <PageLayout contentWidth={2} title="Profil">
    <ProfileForm />
  </PageLayout>
)

export default Profil
