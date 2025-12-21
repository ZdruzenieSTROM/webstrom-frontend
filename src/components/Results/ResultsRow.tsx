import {Box, Stack, Theme, Typography, useMediaQuery} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import NextLink from 'next/link'
import {FC} from 'react'

import {colors} from '@/theme/colors'
import {Result, SolutionShort} from '@/types/api/competition'
import {useHasPermissions} from '@/utils/useHasPermissions'

const ResultsRowNumber: FC<{solution: SolutionShort; registrationId: number}> = ({solution, registrationId}) => {
  const {hasPermissions} = useHasPermissions()
  const commonStyles = {width: {xs: '12px', sm: '18px'}, textAlign: 'center'}

  const solutionContent = (
    <Typography variant="resultsScore" sx={commonStyles}>
      {solution.points}
    </Typography>
  )

  if (!hasPermissions) {
    return solutionContent
  }

  const href =
    solution.solution_pk === null
      ? `/admin#/competition/solution/create?semester_registration=${registrationId}&problem=${solution.problem_pk}`
      : `/admin#/competition/solution/${solution.solution_pk}`

  return (
    <Box
      component={NextLink}
      href={href}
      target="_blank"
      sx={{
        display: 'inline-flex',
        cursor: 'pointer',
        border: 0,
        bgcolor: 'inherit',
        color: 'inherit',
        borderColor: 'inherit',
        '--bgcolor': 'inherit',
        '--color': 'inherit',
        '&:hover': {
          '--bgcolor': colors.white,
          '--color': colors.black,
          bgcolor: colors.white,
          color: colors.black,
        },
        ...commonStyles,
      }}
    >
      {solutionContent}
    </Box>
  )
}

export const ResultsRow: FC<{result: Result}> = ({result}) => {
  const {solutions, rank_changed, rank_start, registration, subtotal, total} = result

  const smUp = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'))

  return (
    // `display: 'contents'` je taka HTML verzia fragmentu - tento div sa v strukture nepocita pre ucely parent gridu,
    // miesto toho sa pouzivaju jednotlive children. preto aj hover tu targetuje children divy, lebo parent v podstate nema velkost.
    // takisto `justifyContent: 'center'` je na vsetkych elementoch osobitne
    <Box sx={{display: 'contents', ':hover > div': {bgcolor: colors.black, color: colors.white}}}>
      <Stack
        sx={{
          justifyContent: 'center',
          // top-level PageLayout padding je vypnuty, odsadzame to rucne tu
          pl: 1,
          pr: {xs: '3px', sm: '5px'},
        }}
      >
        <Typography variant="resultsOrder">{rank_changed && rank_start + '.'}</Typography>
      </Stack>
      <Stack sx={{px: {xs: '3px', sm: '5px'}, justifyContent: 'center'}}>
        <Typography variant="resultsName">
          {registration.profile.first_name + ' ' + registration.profile.last_name}
        </Typography>
        <Typography variant="resultsSchool">
          {smUp
            ? `${registration.school.name} ${registration.school.street} ${registration.school.city}`
            : registration.school.abbreviation}
        </Typography>
      </Stack>
      <Stack sx={{px: {xs: '3px', sm: '5px'}, justifyContent: 'center'}}>
        {/* reused resultsName font */}
        <Typography variant="resultsName" fontWeight={400}>
          {registration.grade.tag}
        </Typography>
      </Stack>
      <Stack sx={{justifyContent: 'center', px: {xs: '3px', sm: '5px'}}}>
        {solutions.map((series, index) => (
          <Stack key={index} direction="row">
            {series.map((solution, solutionIndex) => (
              <ResultsRowNumber key={solutionIndex} solution={solution} registrationId={registration.id} />
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
            pl: {xs: '3px', sm: '5px'},
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
