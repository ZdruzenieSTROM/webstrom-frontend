import {Box, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, {useState} from 'react'

import {colors} from '@/colors'
import Strom from '@/svg/strom.svg'

import {Button} from '../Clickable/Button'
import {Link} from '../Clickable/Link'

export const Crossroad: React.FC = () => {
  const [isProblem, setIsProblem] = useState(false)

  const crossroadItems = [
    {label: 'STROM', url: 'strom'},
    {label: 'Matik', url: 'matik'},
    {label: 'Malynár', url: 'malynar'},
    {label: 'Kôš', url: 'https://kos.strom.sk'},
    {label: 'Máš problém', url: 'https://masproblem.strom.sk'},
  ]
  return !isProblem ? (
    <Stack justifyContent="center" alignItems="center" height="100dvh" sx={{bgcolor: colors.black}}>
      <Typography variant="crossroadButton" sx={{color: colors.white}}>
        Máš problém?
      </Typography>
      <Stack spacing={2} direction="row">
        <Link variant="crossroadButton" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" invertColors>
          Áno
        </Link>
        <Button variant="crossroadButton" onClick={() => setIsProblem(true)} invertColors>
          Nie
        </Button>
      </Stack>
    </Stack>
  ) : (
    <Stack alignItems="stretch" height="100vh" sx={{bgcolor: colors.black}}>
      <Grid container disableEqualOverflow columnSpacing={{xs: 2, md: 3, lg: 4}} mt={'30vh'} flexGrow={1}>
        <Grid xs={0} md={3} display={{xs: 'none', md: 'flex'}} height="70dvh" justifyContent="end">
          <Box>
            <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="white" />
          </Box>
        </Grid>
        <Grid xs={12} md={9}>
          <Stack gap={{xs: 1, sm: 2}}>
            {crossroadItems.map(({label, url}) => (
              <Link key={label} variant="crossroadButton" href={url} invertColors>
                {label}
              </Link>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
