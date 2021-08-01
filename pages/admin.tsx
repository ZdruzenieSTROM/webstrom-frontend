import {NextPage} from 'next'
import dynamic from 'next/dynamic'

// admin musi byt renderovany client-side: https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
// eslint-disable-next-line @typescript-eslint/ban-types
const AdminWithNoSSR = dynamic<{}>(() => import('../src/components/Admin/Admin').then((mod) => mod.Admin), {ssr: false})

const Admin: NextPage = () => <AdminWithNoSSR />

export default Admin
