import {Box, Grid, Stack, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material'
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

interface NavigationLinkProps {
  label: string
  url: string
}

const NavigationLink: React.FC<NavigationLinkProps> = ({label, url}) => (
  <Link
    variant="h1"
    href={url}
    invertColors
    sx={{width: {xs: 'auto', md: '100%'}, pl: 0}}
    textSx={{width: {xs: 'auto', md: '100%'}}}
  >
    {label}
  </Link>
)

const SectionHeader: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Typography variant="h3" color="white" sx={{pt: 3, pb: 2}}>
    {children}
  </Typography>
)

export const Crossroad: React.FC = () => {
  return (
    <Stack alignItems="stretch" height="100vh" sx={{bgcolor: colors.black}}>
      <Grid container columnSpacing={{xs: 1, md: 2, lg: 4}} mt={{xs: '5vh', md: '30vh'}} flexGrow={1}>
        <Grid
          size={{xs: 12, md: 3}}
          height={{xs: '10vh', md: '70vh'}}
          justifyContent={{xs: 'center', md: 'end'}}
          display="flex"
        >
          <Box>
            <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="white" />
          </Box>
        </Grid>
        <Grid
          size={{xs: 12, md: 9}}
          container
          height={{xs: '80vh', md: '70vh'}}
          pr={{xs: 1, md: 3}}
          sx={{overflow: 'auto'}}
        >
          {/* Mobile view: stacked list */}
          <Stack
            gap={1}
            sx={{
              display: {xs: 'flex', md: 'none'},
              width: '100%',
              alignItems: 'center',
            }}
          >
            <NavigationLink url="/strom/o-nas" label="O združení" />
            {seminarItems.map((item) => (
              <NavigationLink key={item.label} url={item.url} label={item.label} />
            ))}
            {competitionItems.map((item) => (
              <NavigationLink key={item.label} url={item.url} label={item.label} />
            ))}
            {campItems.map((item) => (
              <NavigationLink key={item.label} url={item.url} label={item.label} />
            ))}
            <NavigationLink url="/strom/podporte-nas" label="Podporte nás" />
          </Stack>

          {/* Desktop view: table */}
          <Box sx={{width: '100%', height: 'fit-content', display: {xs: 'none', md: 'block'}}}>
            <Table
              sx={{
                '& td': {border: 'none', verticalAlign: 'top', pl: 0, pt: 0, pr: 4, pb: 1},
                width: '100%',
                tableLayout: 'auto',
              }}
            >
              <TableBody>
                {/* Row 1: O združení | empty | empty */}
                <TableRow>
                  <TableCell>
                    <NavigationLink url="/strom/o-nas" label="O združení" />
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>

                {/* Row 2: Semináre | Jednodňové súťaže | Tábory */}
                <TableRow>
                  <TableCell>
                    <SectionHeader>Semináre</SectionHeader>
                  </TableCell>
                  <TableCell>
                    <SectionHeader>Jednodňové súťaže</SectionHeader>
                  </TableCell>
                  <TableCell>
                    <SectionHeader>Tábory</SectionHeader>
                  </TableCell>
                </TableRow>

                {/* Row 3: STROM | Matboj | TMM */}
                <TableRow>
                  <TableCell>
                    <NavigationLink url={seminarItems[0].url} label={seminarItems[0].label} />
                  </TableCell>
                  <TableCell>
                    <NavigationLink url={competitionItems[0].url} label={competitionItems[0].label} />
                  </TableCell>
                  <TableCell>
                    <NavigationLink url={campItems[0].url} label={campItems[0].label} />
                  </TableCell>
                </TableRow>

                {/* Row 4: Matik | Lomihlav | Primat */}
                <TableRow>
                  <TableCell>
                    <NavigationLink url={seminarItems[1].url} label={seminarItems[1].label} />
                  </TableCell>
                  <TableCell>
                    <NavigationLink url={competitionItems[1].url} label={competitionItems[1].label} />
                  </TableCell>
                  <TableCell>
                    <NavigationLink url={campItems[1].url} label={campItems[1].label} />
                  </TableCell>
                </TableRow>

                {/* Row 5: Malynár | Mamut | empty */}
                <TableRow>
                  <TableCell>
                    <NavigationLink url={seminarItems[2].url} label={seminarItems[2].label} />
                  </TableCell>
                  <TableCell>
                    <NavigationLink url={competitionItems[2].url} label={competitionItems[2].label} />
                  </TableCell>
                  <TableCell />
                </TableRow>

                {/* Row 6: empty | Máš problém?! | empty */}
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <NavigationLink url={competitionItems[3].url} label={competitionItems[3].label} />
                  </TableCell>
                  <TableCell />
                </TableRow>

                {/* Row 7: empty | Kôš | Podporte nás */}
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <NavigationLink url={competitionItems[4].url} label={competitionItems[4].label} />
                  </TableCell>
                  <TableCell>
                    <NavigationLink url="/strom/podporte-nas" label="Podporte nás" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  )
}
