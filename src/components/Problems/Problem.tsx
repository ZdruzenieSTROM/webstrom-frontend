import {Stack, Typography} from '@mui/material'
import Image from 'next/image'
import {Dispatch, FC, SetStateAction, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {Problem as ProblemType} from '@/types/api/competition'
import {AuthContainer} from '@/utils/AuthContainer'

import {Markdown} from '../Markdown/Markdown'
import styles from './Problem.module.scss'
import {UploadProblemForm} from './UploadProblemForm'

export const Problem: FC<{
  problem: ProblemType
  setDisplaySideContent: Dispatch<
    SetStateAction<{
      type: string
      problemId: number
      problemNumber: number
      problemSubmitted?: boolean
    }>
  >
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
  setDisplaySideContent,
  canRegister,
  canSubmit,
  isAfterDeadline,
  invalidateSeriesQuery,
  displayRegisterDialog,
  displayLoginDialog,
}) => {
  const handleDiscussionButtonClick = () => {
    setDisplaySideContent((prevState) => {
      if (prevState.type === 'discussion' && prevState.problemId === problem.id) {
        return {type: '', problemId: -1, problemNumber: -1}
      } else {
        return {type: 'discussion', problemId: problem.id, problemNumber: problem.order}
      }
    })
  }
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
          <Image
            src={problem.image}
            alt={`Obrázok - ${problem.order} úloha`}
            className={styles.image}
            width={800} // These values are overwritten by css
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
          <Button onClick={handleDiscussionButtonClick} variant="button2">
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
