import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {Dispatch, FC, SetStateAction} from 'react'
import {useDropzone} from 'react-dropzone'

import {niceBytes} from '@/utils/niceBytes'

import {Button} from '../Clickable/Clickable'
import {SideContainer} from './SideContainer'
import styles from './UploadProblemForm.module.scss'

export const UploadProblemForm: FC<{
  problemId: number
  problemNumber: number
  setDisplaySideContent: Dispatch<
    SetStateAction<{
      type: string
      problemId: number
      problemNumber: number
    }>
  >
  invalidateSeriesQuery: () => Promise<void>
}> = ({problemId, problemNumber, setDisplaySideContent, invalidateSeriesQuery}) => {
  const {mutate: uploadSolution} = useMutation({
    mutationFn: (formData: FormData) => axios.post(`/api/competition/problem/${problemId}/upload-solution`, formData),
    onSuccess: (response) => {
      if (response.status === 201) {
        setDisplaySideContent({type: '', problemId: -1, problemNumber: -1})
        // refetch serie, nech sa aktualizuje problem.submitted
        invalidateSeriesQuery()
        alert('Riešenie úspešne nahrané.')
      } else {
        console.warn(response)
        alert(
          'Niečo sa ASI pokazilo, skontroluj, či bolo riešenie nahrané, a ak si technický typ, môžeš pozrieť chybu v konzole.',
        )
      }
    },
  })

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    await uploadSolution(formData)
  }

  return (
    <SideContainer title={'Odovzdať úlohu - ' + problemNumber}>
      <div className={styles.container}>
        <div {...getRootProps({className: styles.dropzone})}>
          <input {...getInputProps()} />
          <p>Vlož riešenie</p>
        </div>
        <div className={styles.files}>
          <h4>Súbor:</h4>
          {acceptedFiles[0]?.name && (
            <span>
              {acceptedFiles[0].name} ({niceBytes(acceptedFiles[0].size)})
            </span>
          )}
        </div>
        <div className={styles.bottomAction}>
          <Button onClick={handleSubmit}>Odovzdať</Button>
        </div>
      </div>
    </SideContainer>
  )
}
