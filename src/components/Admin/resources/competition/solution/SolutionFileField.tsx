import Link from '@mui/material/Link'
import type {FC} from 'react'
import type {FieldProps, RaRecord} from 'react-admin'
import {useRecordContext} from 'react-admin'

import {parseFilenameFromUrl} from '@/utils/parseFilenameFromUrl'

type SolutionFileFieldProps = FieldProps<RaRecord> & {
  getUrl: (solutionId: number) => string
}

export const SolutionFileField: FC<SolutionFileFieldProps> = ({source, getUrl}) => {
  const record = useRecordContext<RaRecord>()

  if (!record || !record[source]) {
    return null
  }

  const originalSolutionUrl = record[source] as string
  const filename = parseFilenameFromUrl(originalSolutionUrl)
  const solutionUrl = getUrl(Number(record.id))

  return (
    <Link href={solutionUrl} target="_blank" rel="noreferrer" variant="body2">
      {filename}
    </Link>
  )
}
