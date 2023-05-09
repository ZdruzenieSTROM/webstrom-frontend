import {NextPage} from 'next'
import dynamic from 'next/dynamic'

// admin musi byt renderovany client-side: https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const AdminWithNoSSR = dynamic(() => import('@/components/Admin/Admin').then((mod) => mod.Admin), {ssr: false})

const Admin: NextPage = () => <AdminWithNoSSR />

export default Admin
