import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Loading} from '@/components/Loading/Loading'
import {ILogo, Logo} from '@/components/PageLayout/Footer/Logo'

import styles from './Footer.module.scss'
import logoStyles from './Logo.module.scss'

export const Footer: FC = () => {
  const {
    data: postsData,
    isLoading: logosIsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ['cms', 'logo'],
    queryFn: () => axios.get<ILogo[]>('/api/cms/logo'),
  })
  const logos = postsData?.data ?? []

  return (
    <div className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.content}>
          <div className={logoStyles.logosRow}>
            {logosIsLoading && <Loading />}
            {logos.map((post) => (
              <Logo key={post.id} {...post} />
            ))}
            {postsError && <p>{postsError.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
