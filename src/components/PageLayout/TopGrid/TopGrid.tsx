import {Grid, Stack, Typography} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useMemo} from 'react'

import {Link} from '@/components/Clickable/Link'
import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {colors} from '@/theme/colors'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Banner} from '../Banner/Banner'
import {MenuMain} from '../MenuMain/MenuMain'

type SeminarButtonsProps = {
  seminar: string
}
const SeminarButtons: FC<SeminarButtonsProps> = ({seminar}) => {
  return (
    <Stack sx={{flexDirection: 'row', gap: 1, justifyContent: 'end', flexWrap: 'wrap'}}>
      <Link
        href="/malynar"
        variant="seminarButton"
        sx={seminar === 'malynar' ? {color: colors.white, backgroundColor: colors.black} : {}}
      >
        Malynár
      </Link>
      <Link
        variant="seminarButton"
        href="/matik"
        sx={seminar === 'matik' ? {color: colors.white, backgroundColor: colors.black} : {}}
      >
        Matik
      </Link>
      <Link
        variant="seminarButton"
        href="/strom"
        sx={seminar === 'strom' ? {color: colors.white, backgroundColor: colors.black} : {}}
      >
        Strom
      </Link>
    </Stack>
  )
}

type TopGridProps = {
  title: string
  subtitle?: string
  bannerMessages?: string[]
}

export const TopGrid: FC<TopGridProps> = ({title, subtitle, bannerMessages}) => {
  const {seminar} = useSeminarInfo()

  // z napr. `/matik/zadania(/*)` vytiahne `zadania`
  const pathname = useRouter().pathname.split('/')

  const semesterPickerPage = useMemo(() => {
    if (pathname[2] === 'zadania' || pathname[2] === 'poradie') {
      return pathname[2]
    }
    if (pathname[2] === 'admin' && pathname[3] === 'opravovanie') {
      return 'admin/opravovanie'
    }
    return undefined
  }, [pathname])

  return (
    <Stack sx={{position: 'sticky', top: 0, width: '100%', backgroundColor: colors.white, zIndex: 3}}>
      <Grid container spacing={1} p={3}>
        {/* first row */}
        <Grid size={{xs: 0, md: 3}} sx={{display: {xs: 'none', md: 'block'}}}>
          <Stack sx={{alignItems: 'start'}}>
            <MenuMain />
          </Stack>
        </Grid>
        <Grid size={{xs: 0, md: 9}} sx={{display: {xs: 'none', md: 'block'}}}>
          <SeminarButtons seminar={seminar} />
        </Grid>
        <Grid size={{xs: 12, md: 0}} sx={{display: {xs: 'block', md: 'none'}}}>
          <Stack sx={{flexDirection: 'row', gap: 2, justifyContent: 'end'}}>
            <SeminarButtons seminar={seminar} />
            <Stack sx={{flexShrink: 0}}>
              <MenuMain />
            </Stack>
          </Stack>
        </Grid>

        {/* second row */}
        <Grid size={{xs: 12, md: 6}} offset={{xs: 0, md: 3}}>
          {subtitle && <Typography variant="h2">{subtitle}</Typography>}
          <Typography variant="h1">{title}</Typography>
        </Grid>
        {semesterPickerPage && (
          <Grid size={{xs: 12, md: 3}}>
            <SemesterPicker page={semesterPickerPage} />
          </Grid>
        )}
      </Grid>

      <Banner bannerMessages={bannerMessages} />
    </Stack>
  )
}
