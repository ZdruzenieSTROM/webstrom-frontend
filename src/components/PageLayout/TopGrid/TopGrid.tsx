import {Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {useRouter} from 'next/router'
import {FC, useMemo} from 'react'

import {Link} from '@/components/Clickable/Link'
import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Banner} from '../Banner/Banner'
import {MenuMain} from '../MenuMain/MenuMain'

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
    <Stack sx={{position: 'sticky', top: 0, width: '100%', backgroundColor: 'white', zIndex: 3}}>
      <Grid container disableEqualOverflow spacing={1} p={3} columns={{xs: 6, md: 12}}>
        {/* first row */}
        <Grid xs={6} md={3}>
          <Stack sx={{alignItems: {xs: 'end', md: 'start'}}}>
            <MenuMain />
          </Stack>
        </Grid>
        <Grid md={6} sx={{display: {xs: 'none', md: 'block'}}} />
        <Grid md={3} sx={{display: {xs: 'none', md: 'block'}}}>
          <Stack sx={{flexDirection: 'row', spacing: 2, justifyContent: 'flex-end'}}>
            <Link
              href="/malynar"
              variant="button1"
              sx={seminar === 'malynar' ? {color: 'white', backgroundColor: 'black'} : {}}
            >
              Malynár
            </Link>
            <Link
              variant="button1"
              href="/matik"
              sx={seminar === 'matik' ? {color: 'white', backgroundColor: 'black'} : {}}
            >
              Matik
            </Link>
            <Link
              variant="button1"
              href="/strom"
              sx={seminar === 'strom' ? {color: 'white', backgroundColor: 'black'} : {}}
            >
              Strom
            </Link>
          </Stack>
        </Grid>

        {/* second row */}
        <Grid md={3} sx={{display: {xs: 'none', md: 'block'}}} />
        <Grid xs={6} md={6}>
          <Typography variant="h1">{pageTitle}</Typography>
        </Grid>
        {semesterPickerPage && (
          <Grid xs={6} md={3}>
            <Stack sx={{alignItems: 'flex-end'}}>
              <SemesterPicker page={semesterPickerPage} />
            </Stack>
          </Grid>
        )}
      </Grid>

      <Banner />
    </Stack>
  )
}
