import {Box, Stack, Typography} from '@mui/material'
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
  grade: string
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

  return (
    // `display: 'contents'` je taka HTML verzia fragmentu - tento div sa v strukture nepocita pre ucely parent gridu,
    // miesto toho sa pouzivaju jednotlive children. preto aj hover tu targetuje children divy, lebo parent v podstate nema velkost
    // takisto `justifyContent: 'center'` je na vsetkych elementoch osobitne
    <Box sx={{display: 'contents', ':hover > div': {bgcolor: 'black', color: 'white'}}}>
      <Stack
        sx={{
          justifyContent: 'center',
          // top-level PageLayout padding je vypnuty, odsadzame to rucne tu
          pl: 1,
        }}
      >
        <Typography variant="h1" component="span">
          {rank_changed && rank_start + '.'}
        </Typography>
      </Stack>
      <Stack sx={{px: '10px', justifyContent: 'center'}}>
        <Typography variant="h3" component="span">
          {registration.profile.first_name + ' ' + registration.profile.last_name}
        </Typography>
        <Typography variant="body3">
          {registration.school.name + ' ' + registration.school.street + ' ' + registration.school.city}
        </Typography>
      </Stack>
      <Stack sx={{justifyContent: 'center'}}>
        <Typography variant="h3" component="span" fontWeight={400} fontStyle="italic">
          {registration.grade}
        </Typography>
      </Stack>
      <Stack sx={{justifyContent: 'center', px: '10px'}}>
        {solutions.map((series, index) => (
          <Stack key={index} direction="row">
            {series.map((solution, index) => (
              <Typography key={index} variant="body2" sx={{width: '18px', textAlign: 'center'}}>
                {solution.points}
              </Typography>
            ))}
            <Tooltip title={`Súčet bodov za ${index + 1}. sériu po uplatnení bonifikácie`}>
              <Typography variant="body2" fontWeight={600} sx={{width: '25px', textAlign: 'center'}}>
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
          <Typography variant="h3" component="span" fontStyle="italic">
            {total}
          </Typography>
        </Stack>
      </Tooltip>
    </Box>
  )
}
