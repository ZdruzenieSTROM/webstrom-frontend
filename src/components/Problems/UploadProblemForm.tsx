import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {Dispatch, FC, SetStateAction, useState} from 'react'
import {useDropzone} from 'react-dropzone'

import {CloseButton} from '@/components/CloseButton/CloseButton'
import {niceBytes} from '@/utils/niceBytes'

import {Button} from '../Clickable/Button'
import {Dialog} from '../Dialog/Dialog'
import {FileDropZone} from '../FileDropZone/FileDropZone'
import styles from './UploadProblemForm.module.scss'

export const UploadProblemForm: FC<{
  problemId: number
  setDisplayProblemUploadForm: Dispatch<SetStateAction<boolean>>
  problemSubmitted: boolean
  isAfterDeadline: boolean
  setDisplayActions: Dispatch<SetStateAction<boolean>>
  invalidateSeriesQuery: () => Promise<void>
}> = ({
  problemId,
  setDisplayActions,
  setDisplayProblemUploadForm,
  problemSubmitted,
  isAfterDeadline,
  invalidateSeriesQuery,
}) => {
  const {mutate: uploadSolution} = useMutation({
    mutationFn: (formData: FormData) => axios.post(`/api/competition/problem/${problemId}/upload-solution`, formData),
    onSuccess: (response) => {
      if (response.status === 201) {
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

  const [files, setFiles] = useState<File | undefined>(undefined)
  const {fileRejections, getRootProps, getInputProps} = useDropzone({
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
    },
    onDrop: (acceptedFiles) => !!acceptedFiles[0] && setFiles(acceptedFiles[0]),
  })

  const handleSubmit = async () => {
    const formData = new FormData()
    if (files) formData.append('file', files)

    uploadSolution(formData)
    setDisplayActions(true)
    setDisplayProblemUploadForm(false)
  }

  const handleRemoveSelection = () => {
    setFiles(undefined)
  }

  const handleCloseButton = () => {
    setDisplayProblemUploadForm(false)
    setDisplayActions(true)
  }

  const [displayAlertDialog, setDisplayAlertDialog] = useState<boolean>(problemSubmitted)
  const closeAlertDialog = () => setDisplayAlertDialog(false)
  const cancel = () => {
    closeAlertDialog()
    setDisplayProblemUploadForm(false)
    setDisplayActions(true)
  }

  const alertMessage = isAfterDeadline
    ? 'Toto riešenie nahrávaš PO TERMÍNE. Nahraním nového riešenia prepíšeš svoje predošlé odovzdanie a pri hodnotení budeme zohľadnovať len toto nové riešenie.'
    : 'Nahraním nového riešenia prepíšeš svoje predošlé odovzdanie a pri hodnotení budeme zohľadnovať len toto nové riešenie.'

  return (
    <div className={styles.container}>
      {isAfterDeadline && <div className={styles.problemSubmitted}>Toto riešenie už nahrávaš po termíne.</div>}
      {problemSubmitted && (
        <div className={styles.problemSubmitted}>
          Pozor, nahraním nového riešenia prepíšeš svoje predošlé odovzdanie.
        </div>
      )}
      <Dialog
        open={displayAlertDialog}
        close={closeAlertDialog}
        title="Pozor"
        contentText={alertMessage}
        actions={
          <>
            <Button variant="button2" onClick={cancel}>
              Zrušiť
            </Button>
            <Button variant="button2" onClick={closeAlertDialog}>
              Pokračovať
            </Button>
          </>
        }
      />
      <div className={styles.inputWrapper}>
        {!files && (
          <>
            <CloseButton onClick={handleCloseButton} size={24} invertColors className={styles.closeButton} />
            <FileDropZone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              text="Vlož riešenie vo formáte pdf"
            />
          </>
        )}
        {files?.name && (
          <div className={styles.files}>
            <div>
              <b>Súbor: </b>

              <span>
                {files.name} ({niceBytes(files.size)})
              </span>
            </div>
            <div className={styles.actions}>
              <Button variant="button2" onClick={handleSubmit}>
                Uložiť
              </Button>
              <Button variant="button2" onClick={handleRemoveSelection}>
                Zrušiť
              </Button>
            </div>

            {fileRejections.length > 0 && <span>Nahraný súbor musí byť vo formáte pdf.</span>}
          </div>
        )}
      </div>
    </div>
  )
}
