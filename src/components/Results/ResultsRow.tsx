import {Box, Stack, Theme, Typography, useMediaQuery} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {FC} from 'react'

interface Registration {
  school: {
    code: number
    name: string
    abbreviation: string
    street: string
    city: string
    zip_code: string
  }
  grade: {
    name: string
    tag: string
    years_until_graduation: number
    is_active: boolean
  }
  profile: {
    first_name: string
    last_name: string
    nickname: string
  }
}

export interface Result {
  rank_start: number
  rank_end: number
  rank_changed: boolean
  registration: Registration
  subtotal: number[]
  total: number
  solutions: {
    points: string
    solution_pk: number
    problem_pk: number
    votes: number
  }[][]
}

export const ResultsRow: FC<{result: Result}> = ({result}) => {
  const {solutions, rank_changed, rank_start, registration, subtotal, total} = result

  const smUp = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'))

  return (
    // `display: 'contents'` je taka HTML verzia fragmentu - tento div sa v strukture nepocita pre ucely parent gridu,
    // miesto toho sa pouzivaju jednotlive children. preto aj hover tu targetuje children divy, lebo parent v podstate nema velkost.
    // takisto `justifyContent: 'center'` je na vsetkych elementoch osobitne
    <Box sx={{display: 'contents', ':hover > div': {bgcolor: 'black', color: 'white'}}}>
      <Stack
        sx={{
          justifyContent: 'center',
          // top-level PageLayout padding je vypnuty, odsadzame to rucne tu
          pl: 1,
        }}
      >
        <Typography variant="resultsOrder">{rank_changed && rank_start + '.'}</Typography>
      </Stack>
      <Stack sx={{px: {xs: '6px', sm: '10px'}, justifyContent: 'center'}}>
        <Typography variant="resultsName">
          {registration.profile.first_name + ' ' + registration.profile.last_name}
        </Typography>
        <Typography variant="resultsSchool">
          {smUp
            ? `${registration.school.name} ${registration.school.street} ${registration.school.city}`
            : registration.school.abbreviation}
        </Typography>
      </Stack>
      <Stack sx={{justifyContent: 'center'}}>
        {/* reused resultsName font */}
        <Typography variant="resultsName" fontWeight={400}>
          {registration.grade.tag}
        </Typography>
      </Stack>
      <Stack sx={{justifyContent: 'center', px: {xs: '6px', sm: '10px'}}}>
        {solutions.map((series, index) => (
          <Stack key={index} direction="row">
            {series.map((solution, index) => (
              <Typography
                key={index}
                variant="resultsScore"
                sx={{width: {xs: '12px', sm: '18px'}, textAlign: 'center'}}
              >
                {solution.points}
              </Typography>
            ))}
            <Tooltip title={`Súčet bodov za ${index + 1}. sériu po uplatnení bonifikácie`}>
              <Typography
                variant="resultsScore"
                fontWeight={600}
                sx={{width: {xs: '18px', sm: '25px'}, textAlign: 'center'}}
              >
                {subtotal[index]}
              </Typography>
            </Tooltip>
          </Stack>
        ))}
      </Stack>
      <Tooltip title="Celkový súčet bodov po uplatnení bonifikácie">
        <Stack
          sx={{
            justifyContent: 'center',
            // top-level PageLayout padding je vypnuty, odsadzame to rucne tu
            pr: 1,
          }}
        >
          <Typography variant="resultsTotal">{total}</Typography>
        </Stack>
      </Tooltip>
    </Box>
  )
}
