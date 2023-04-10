import axios, {AxiosError} from 'axios'
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
}> = ({problemId, problemNumber, setDisplaySideContent}) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    try {
      const response = await axios.post(`/api/competition/problem/${problemId}/upload-solution`, formData)
      if (response.status === 201) {
        setDisplaySideContent({type: '', problemId: -1, problemNumber: -1})
        console.log('file uploaded') // ToDo: remove log() and let user know the response! message system? or something else?
        // TODO: ked sa uploadne, tak button "moje riesenie" je stale sivy, lebo nie su natahane `problems` znova. asi nejaky hook(?)
      }
    } catch (e: unknown) {
      console.log(e)
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      alert(error)
    }
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
