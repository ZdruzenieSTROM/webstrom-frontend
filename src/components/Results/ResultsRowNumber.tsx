import {Box, Typography} from '@mui/material'
import NextLink from 'next/link'
import {FC} from 'react'

import {colors} from '@/theme/colors'
import {EventRegistration, SolutionShort} from '@/types/api/competition'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useProfile} from '@/utils/useProfile'

const numberWidthStyle = {width: {xs: '12px', sm: '18px'}, textAlign: 'center'}

const NumberAsLink: FC<{
  numberHref: string
  solutionPoints: string
}> = ({numberHref, solutionPoints}) => (
  <Box
    component={NextLink}
    href={numberHref}
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
      justifyContent: 'center',
      ...numberWidthStyle,
    }}
  >
    <Typography variant="resultsScore">{solutionPoints}</Typography>
  </Box>
)

export const ResultsRowNumber: FC<{solution: SolutionShort; registration: EventRegistration}> = ({
  solution,
  registration,
}) => {
  const {hasPermissions} = useHasPermissions()
  const {profile} = useProfile()
  let numberHref = undefined

  if (hasPermissions) {
    numberHref =
      solution.solution_pk === null
        ? `/admin#/competition/solution/create?semester_registration=${registration.id}&problem=${solution.problem_pk}`
        : `/admin#/competition/solution/${solution.solution_pk}`
  } else if (solution.solution_pk && registration.profile.id === profile?.id) {
    numberHref = `/api/competition/problem/${solution.problem_pk}/my-solution`
  }

  if (numberHref) {
    return <NumberAsLink numberHref={numberHref} solutionPoints={solution.points} />
  }

  return (
    <Typography variant="resultsScore" sx={{...numberWidthStyle, textAlign: 'center'}}>
      {solution.points}
    </Typography>
  )
}
