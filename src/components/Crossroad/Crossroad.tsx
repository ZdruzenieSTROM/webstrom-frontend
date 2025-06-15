import {Box, Grid, Stack} from '@mui/material'
import React from 'react'

import {colors} from '@/colors'
import Strom from '@/svg/strom.svg'

import {Link} from '../Clickable/Link'

const crossroadItems = [
  {label: 'STROM', url: 'strom', variant: 'h1'},
  {label: 'Matik', url: 'matik', variant: 'h1'},
  {label: 'Malynár', url: 'malynar', variant: 'h1'},
  {label: 'Matboj', url: 'strom/akcie/matboj', variant: 'h2'},
  {label: 'Lomihlav', url: 'matik/akcie/lomihlav', variant: 'h2'},
  {label: 'Mamut', url: 'malynar/akcie/mamut', variant: 'h2'},
  {label: 'Kôš', url: 'https://kos.strom.sk', variant: 'h2'},
  {label: 'Máš problém', url: 'https://masproblem.strom.sk', variant: 'h2'},
  {label: 'TMM', url: 'matik/akcie/tmm', variant: 'h2'},
] as const

export const Crossroad: React.FC = () => {
  return (
    <Stack alignItems="stretch" height="100vh" sx={{bgcolor: colors.black}}>
      <Grid container columnSpacing={{xs: 2, md: 3, lg: 4}} mt={'30vh'} flexGrow={1}>
        <Grid size={{xs: 0, sm: 3}} display={{xs: 'none', sm: 'flex'}} height="70dvh" justifyContent="end">
          <Box>
            <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="white" />
          </Box>
        </Grid>
        <Grid size={{xs: 12, sm: 9}} height="70dvh" sx={{overflow: 'auto'}}>
          <Stack gap={{xs: 1, sm: 2}}>
            {crossroadItems.map(({label, url, variant}) => (
              <Link key={label} variant={variant} href={url} invertColors>
                {label}
              </Link>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
