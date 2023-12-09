import {Stack} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Loading} from '@/components/Loading/Loading'
import {ILogo, Logo} from '@/components/PageLayout/Footer/Logo'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const {
    data: postsData,
    isLoading: logosIsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ['cms', 'logo'],
    queryFn: () => axios.get<ILogo[]>('/api/cms/logo'),
  })
  const logos = postsData?.data.filter((logo) => !logo.disabled) ?? []

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Stack direction="row" m={2} gap={2} justifyContent="center" sx={{flexWrap: 'wrap'}}>
          {logosIsLoading && <Loading />}
          {logos.map((logo) => (
            <Logo key={logo.id} {...logo} />
          ))}
          {postsError && <p>{postsError.message}</p>}
        </Stack>
      </div>
    </div>
  )
}
