import {Typography} from '@mui/material'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC} from 'react'

import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import styles from './TopGrid.module.scss'

export const TopGrid: FC = () => {
  const {seminar} = useSeminarInfo()

  // z napr. `/matik/zadania(/*)` vytiahne `zadania`
  const page = useRouter().pathname.split('/')[2]

  const {pageTitle} = PageTitleContainer.useContainer()

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={clsx(styles.menuItem, seminar === 'malynar' && styles.active)}>
          <Typography variant="button1">
            <Link href="/malynar">Malynár</Link>
          </Typography>
        </div>
        <div className={clsx(styles.menuItem, seminar === 'matik' && styles.active)}>
          <Typography variant="button1">
            <Link href="/matik">Matik</Link>
          </Typography>
        </div>
        <div className={clsx(styles.menuItem, seminar === 'strom' && styles.active)}>
          <Typography variant="button1">
            <Link href="/strom">Strom</Link>
          </Typography>
        </div>
      </div>
      <Typography variant="h1" className={styles.title}>
        {pageTitle}
      </Typography>
      {(page === 'zadania' || page === 'vysledky') && (
        <div className={styles.semesterPicker}>
          <SemesterPicker page={page} />
        </div>
      )}
    </div>
  )
}
