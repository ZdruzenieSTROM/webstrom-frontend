import {Box, Stack, Typography} from '@mui/material'
import Image from 'next/image'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {Problem as ProblemType} from '@/types/api/competition'
import {AuthContainer} from '@/utils/AuthContainer'

import {Markdown} from '../Markdown/Markdown'
import {UploadProblemForm} from './UploadProblemForm'

export type DiscussionProblem = {
  id: number
  order: number
}

export const Problem: FC<{
  problem: ProblemType
  openDiscussion: (problem: DiscussionProblem) => void
  registered: boolean
  canRegister: boolean
  canSubmit: boolean
  isAfterDeadline: boolean
  invalidateSeriesQuery: () => Promise<void>
  displayRegisterDialog: () => void
  displayLoginDialog: () => void
}> = ({
  problem,
  registered,
  openDiscussion,
  canRegister,
  canSubmit,
  isAfterDeadline,
  invalidateSeriesQuery,
  displayRegisterDialog,
  displayLoginDialog,
}) => {
  const {isAuthed} = AuthContainer.useContainer()

  const handleUploadClick = () => {
    if (!isAuthed) {
      displayLoginDialog()
    } else if (!registered) {
      displayRegisterDialog()
    } else {
      setDisplayProblemUploadForm((prevState) => !prevState)
      setDisplayActions(false)
    }
  }

  const [displayProblemUploadForm, setDisplayProblemUploadForm] = useState<boolean>(false)
  const [displayActions, setDisplayActions] = useState(true)

  return (
    <div>
      <Typography variant="h3" fontStyle="unset">
        {problem.order}. ÚLOHA
      </Typography>
      <Markdown content={problem.text} />
      {problem.image && (
        <Stack alignItems="center">
          <Box
            component={Image}
            src={problem.image}
            alt={`Obrázok - ${problem.order} úloha`}
            sx={{
              width: 'auto',
              height: 'auto',
              minHeight: '3rem',
              minWidth: '3rem',
              maxHeight: '50vh',
              marginTop: '1rem',
            }}
            // width/height dava len nieco vediet nextu, ale realne sa to styluje stylmi vyssie
            width={800}
            height={800}
          />
        </Stack>
      )}
      {displayProblemUploadForm && (
        <UploadProblemForm
          problemId={problem.id}
          setDisplayProblemUploadForm={setDisplayProblemUploadForm}
          problemSubmitted={!!problem.submitted}
          isAfterDeadline={isAfterDeadline}
          invalidateSeriesQuery={invalidateSeriesQuery}
          setDisplayActions={setDisplayActions}
        />
      )}
      {displayActions && (
        <Stack
          direction="row"
          sx={{
            mt: 0.5,
            justifyContent: 'end',
            flexWrap: 'wrap',
            columnGap: {xs: 1, sm: 2},
            rowGap: 1,
          }}
        >
          {problem.solution_pdf && (
            <Link href={problem.solution_pdf} target="_blank" variant="button2">
              vzorové riešenie
            </Link>
          )}
          {registered && (
            <>
              <Link
                href={`/api/competition/problem/${problem.id}/my-solution`}
                target="_blank"
                disabled={!problem.submitted}
                variant="button2"
              >
                moje riešenie
              </Link>
              <Link
                href={`/api/competition/problem/${problem.id}/corrected-solution`}
                target="_blank"
                disabled={!problem.submitted?.corrected_solution}
                variant="button2"
              >
                opravené riešenie{!!problem.submitted?.corrected_solution && ` (${problem.submitted.score || '?'})`}
              </Link>
            </>
          )}
          <Button onClick={() => openDiscussion(problem)} variant="button2">
            diskusia ({problem.num_comments})
          </Button>
          {canSubmit && (
            <Button onClick={handleUploadClick} disabled={isAuthed && !canRegister} variant="button2">
              odovzdať
            </Button>
          )}
        </Stack>
      )}
    </div>
  )
}
