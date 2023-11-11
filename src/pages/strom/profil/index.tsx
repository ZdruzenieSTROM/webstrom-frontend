import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProfileDetail} from '@/components/Profile/ProfileDetail'

const Profil: NextPage = () => (
  <PageLayout contentWidth={2} title="Profil">
    <ProfileDetail />
  </PageLayout>
)

export default Profil
