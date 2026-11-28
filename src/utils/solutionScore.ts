export const minSolutionScore = -9
export const maxSolutionScore = 9

export const solutionScoreError = `Zadaj celé číslo od ${minSolutionScore} do ${maxSolutionScore}.`

export const isValidSolutionScore = (score: number) =>
  Number.isInteger(score) && score >= minSolutionScore && score <= maxSolutionScore
