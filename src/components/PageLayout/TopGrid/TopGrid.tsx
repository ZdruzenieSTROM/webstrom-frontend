import {Stack, Typography} from '@mui/material'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useMemo} from 'react'

import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Banner} from '../Banner/Banner'
import styles from './TopGrid.module.scss'

export const TopGrid: FC = () => {
  const {seminar} = useSeminarInfo()

  // z napr. `/matik/zadania(/*)` vytiahne `zadania`
  const pathname = useRouter().pathname.split('/')

  const semesterPickerPage = useMemo(() => {
    if (pathname[2] === 'zadania' || pathname[2] === 'vysledky') {
      return pathname[2]
    }
    if (pathname[2] === 'admin' && pathname[3] === 'opravovanie') {
      return 'admin/opravovanie'
    }
    return undefined
  }, [pathname])

  const {pageTitle} = PageTitleContainer.useContainer()

  return (
    <Stack className={styles.container}>
      <div className={styles.grid}>
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
        {semesterPickerPage && (
          <div className={styles.semesterPicker}>
            <SemesterPicker page={semesterPickerPage} />
          </div>
        )}
      </div>
      <Banner />
    </Stack>
  )
}
