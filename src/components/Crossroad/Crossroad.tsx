import {Box, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React from 'react'

import {colors} from '@/colors'
import Strom from '@/svg/strom.svg'

import {Link} from '../Clickable/Link'

const seminarItems = [
  {label: 'STROM', url: 'strom'},
  {label: 'Matik', url: 'matik'},
  {label: 'Malynár', url: 'malynar'},
] as const
const competitionItems = [
  {label: 'Matboj', url: 'strom/akcie/matboj'},
  {label: 'Lomihlav', url: 'matik/akcie/lomihlav'},
  {label: 'Mamut', url: 'malynar/akcie/mamut'},
  {label: 'Máš problém?!', url: 'https://masproblem.strom.sk'},
  {label: 'Kôš', url: 'https://kos.strom.sk'},
] as const
const campItems = [
  {label: 'TMM', url: 'matik/akcie/tmm'},
  {label: 'Primat', url: 'matik/akcie/primat'},
] as const

const SectionTitle: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <Typography
      variant="h3"
      color="white"
      sx={{
        display: {xs: 'none', sm: 'block'},
        mt: 3,
        px: '10px',
        pb: 3,
      }}
    >
      {children}
    </Typography>
  )
}

export const Crossroad: React.FC = () => {
  return (
    <Stack alignItems="stretch" height="100vh" sx={{bgcolor: colors.black}}>
      <Grid
        container
        disableEqualOverflow
        columnSpacing={{xs: 2, md: 3, lg: 4}}
        mt={{xs: '10vh', sm: '30vh'}}
        flexGrow={1}
      >
        <Grid
          xs={12}
          sm={3}
          height={{xs: '10vh', sm: '70vh'}}
          justifyContent={{xs: 'center', sm: 'end'}}
          display="flex"
        >
          <Box>
            <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="white" />
          </Box>
        </Grid>
        <Grid
          xs={12}
          sm={9}
          container
          disableEqualOverflow
          height="70dvh"
          columnSpacing={{xs: 2, md: 3, lg: 4}}
          pr={{xs: 1, md: 3}}
          sx={{overflow: 'auto'}}
        >
          <Grid xs={12} md={12} container>
            <Grid xs={12} md={4} mb={{xs: 1, md: 2}}>
              <Box sx={{textAlign: {xs: 'center', sm: 'left'}}}>
                <Link variant="h1" href="/strom/o-nas" invertColors textSx={{width: {xs: 'auto', md: '100%'}}}>
                  O združení
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Grid xs={12} md={4}>
            <SectionTitle>Semináre</SectionTitle>
            <Stack gap={{xs: 1, md: 2}} alignItems={{xs: 'center', sm: 'flex-start'}}>
              {seminarItems.map(({label, url}) => (
                <Link key={label} variant="h1" href={url} invertColors textSx={{width: {xs: 'auto', md: '100%'}}}>
                  {label}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <SectionTitle>Jednotlivé súťaže</SectionTitle>
            <Stack gap={{xs: 1, md: 2}} alignItems={{xs: 'center', sm: 'flex-start'}}>
              {competitionItems.map(({label, url}) => (
                <Link key={label} variant="h1" href={url} invertColors textSx={{width: {xs: 'auto', md: '100%'}}}>
                  {label}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <SectionTitle>Letné tábory</SectionTitle>
            <Stack gap={{xs: 1, md: 2}} alignItems={{xs: 'center', sm: 'flex-start'}}>
              {campItems.map(({label, url}) => (
                <Link key={label} variant="h1" href={url} invertColors textSx={{width: {xs: 'auto', md: '100%'}}}>
                  {label}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}
