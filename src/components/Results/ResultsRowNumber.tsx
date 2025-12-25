import {Box, Typography} from '@mui/material'
import NextLink from 'next/link'
import {FC, ReactNode} from 'react'

import {colors} from '@/theme/colors'
import {EventRegistration, SolutionShort} from '@/types/api/competition'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useProfile} from '@/utils/useProfile'

const numberWidthStyle = {width: {xs: '12px', sm: '18px'}, textAlign: 'center'}

const LinkBoxWrapper: FC<{
  numberHref: string
  children: ReactNode
}> = ({numberHref, children}) => (
  <Box
    component={NextLink}
    href={numberHref}
    target="_blank"
    sx={{
      display: 'inline-flex',
      cursor: 'pointer',
      border: 0,
      color: 'inherit',
      '&:hover': {
        bgcolor: colors.white,
        color: colors.black,
      },
      justifyContent: 'center',
      ...numberWidthStyle,
    }}
  >
    {children}
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
    return (
      <LinkBoxWrapper numberHref={numberHref}>
        <Typography variant="resultsScore">{solution.points}</Typography>
      </LinkBoxWrapper>
    )
  }

  return (
    <Typography variant="resultsScore" sx={{...numberWidthStyle, textAlign: 'center'}}>
      {solution.points}
    </Typography>
  )
}
