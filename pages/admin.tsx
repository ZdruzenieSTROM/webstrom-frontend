import {NextPage} from 'next'
import dynamic from 'next/dynamic'

// eslint-disable-next-line @typescript-eslint/ban-types
const AdminWithNoSSR = dynamic<{}>(() => import('../src/pages/Admin/Admin').then((mod) => mod.Admin), {ssr: false})

const Admin: NextPage = () => <AdminWithNoSSR />

export default Admin
