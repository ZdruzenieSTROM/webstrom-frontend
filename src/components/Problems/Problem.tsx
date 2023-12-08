import Image from 'next/image'
import {Dispatch, FC, SetStateAction, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {Problem as ProblemType} from '@/types/api/competition'

import {Latex} from '../Latex/Latex'
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
}> = ({
  problem,
  registered,
  setDisplaySideContent,
  canRegister,
  canSubmit,
  isAfterDeadline,
  invalidateSeriesQuery,
  displayRegisterDialog,
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
  const handleUploadClick = () => {
    if (!registered && canRegister) {
      displayRegisterDialog()
    } else {
      setDisplayProblemUploadForm((prevState) => !prevState)
      setDisplayActions(false)
    }
  }

  const [displayProblemUploadForm, setDisplayProblemUploadForm] = useState<boolean>(false)
  const [displayActions, setDisplayActions] = useState(true)

  return (
    <div className={styles.problem}>
      <h3 className={styles.problemTitle}>{problem.order}. ÚLOHA</h3>
      <Latex>{problem.text}</Latex>
      {problem.image && (
        <div className={styles.imageContainer}>
          <Image
            src={problem.image}
            alt={`Obrázok - ${problem.order} úloha`}
            className={styles.image}
            width={800} // These values are overwritten by css
            height={800}
          />
        </div>
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
        <div className={styles.actions}>
          {problem.solution_pdf && (
            <Link href={problem.solution_pdf} target="_blank">
              vzorové riešenie
            </Link>
          )}
          {registered && (
            <>
              <Link
                href={`/api/competition/problem/${problem.id}/my-solution`}
                target="_blank"
                disabled={!problem.submitted}
              >
                moje riešenie
              </Link>
              <Link
                href={`/api/competition/problem/${problem.id}/corrected-solution`}
                target="_blank"
                disabled={!problem.submitted?.corrected_solution}
              >
                opravené riešenie{!!problem.submitted?.corrected_solution && ` (${problem.submitted.score || '?'})`}
              </Link>
            </>
          )}
          <Button onClick={handleDiscussionButtonClick}>diskusia ({problem.num_comments}) </Button>
          {(registered || canRegister) && (
            <Button onClick={handleUploadClick} disabled={!canSubmit}>
              odovzdať
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
