import {NumberInput} from 'react-admin'

import {isValidSolutionScore, maxSolutionScore, minSolutionScore, solutionScoreError} from '@/utils/solutionScore'

const validateScore = (value: number | null | undefined) => {
  if (value != null && !isValidSolutionScore(value)) {
    return solutionScoreError
  }
}

export const SolutionScoreInput = () => (
  <NumberInput source="score" min={minSolutionScore} max={maxSolutionScore} step={1} validate={validateScore} />
)
