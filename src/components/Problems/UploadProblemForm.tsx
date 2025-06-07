import {Box, Stack, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {Dispatch, FC, SetStateAction, useState} from 'react'
import {useDropzone} from 'react-dropzone'

import {apiAxios} from '@/api/apiAxios'
import {CloseButton} from '@/components/CloseButton/CloseButton'
import {Accept} from '@/utils/dropzone-accept'
import {useAlert} from '@/utils/useAlert'

import {Button} from '../Clickable/Button'
import {InlineLink} from '../Clickable/InlineLink'
import {Dialog} from '../Dialog/Dialog'
import {FileDropZone} from '../FileDropZone/FileDropZone'
import {Loading} from '../Loading/Loading'

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
  const {alert} = useAlert()

  const {mutate: uploadSolution, isPending: isUploading} = useMutation({
    mutationFn: (formData: FormData) => apiAxios.post(`/competition/problem/${problemId}/upload-solution`, formData),
    onSuccess: (response) => {
      if (response.status === 201) {
        // refetch serie, nech sa aktualizuje problem.submitted
        invalidateSeriesQuery()
        alert('Riešenie úspešne nahrané.')
      } else {
        // eslint-disable-next-line no-console
        console.warn(response)
        alert(
          'Niečo sa ASI pokazilo, skontroluj, či bolo riešenie nahrané, a ak si technický typ, môžeš pozrieť chybu v konzole.',
        )
      }
      setDisplayActions(true)
      setDisplayProblemUploadForm(false)
    },
  })

  const {fileRejections, getRootProps, getInputProps} = useDropzone({
    multiple: false,
    accept: Accept.Pdf,
    maxSize: 20 * 1024 * 1024, // 20MB in bytes
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])

        uploadSolution(formData)
      }
    },
  })

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
    <Stack
      sx={{
        margin: '0px',
        padding: '10px 0 10px 0',
        flexGrow: 1,
        borderTop: '0px solid black',
        borderBottom: '0px solid black',
        position: 'relative',
      }}
    >
      {isAfterDeadline && (
        <Box sx={{fontWeight: 'bold', textTransform: 'uppercase', fontStyle: 'italic'}}>
          Toto riešenie už nahrávaš po termíne.
        </Box>
      )}
      {problemSubmitted && (
        <Box sx={{fontWeight: 'bold', textTransform: 'uppercase', fontStyle: 'italic'}}>
          Pozor, nahraním nového riešenia prepíšeš svoje predošlé odovzdanie.
        </Box>
      )}
      <Dialog
        open={displayAlertDialog}
        close={closeAlertDialog}
        title="Pozor"
        contentText={alertMessage}
        actions={
          <>
            <Button variant="button2" onClick={closeAlertDialog}>
              Pokračovať
            </Button>
            <Button variant="button2" onClick={cancel}>
              Zrušiť
            </Button>
          </>
        }
      />
      <Box sx={{position: 'relative'}}>
        {isUploading ? (
          <Loading />
        ) : (
          <>
            <CloseButton
              onClick={handleCloseButton}
              size={24}
              invertColors
              sx={{position: 'absolute', top: 2, right: 2, background: 'unset'}}
            />
            <FileDropZone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              text="Vlož riešenie vo formáte pdf"
            />
            <Typography variant="body2" textAlign="center">
              Dbaj na čitateľnosť riešenia - namiesto odfotenia zo zošita ho radšej napíš na čistý papier formátu A4,
              oskenuj (prípadne využi mobilné aplikácie, ktoré skener nahradia) a nahraj ho správne orientované. Ak máš
              riešenie v inom formáte ako PDF, skonvertuj ho napríklad pomocou stránky{' '}
              <InlineLink href="https://www.ilovepdf.com/">ilovepdf.com</InlineLink>.
            </Typography>
          </>
        )}
        {fileRejections.length > 0 && (
          <span>
            {fileRejections[0]?.errors[0]?.code === 'file-too-large'
              ? 'Súbor je príliš veľký. Maximálna povolená veľkosť je 20MB.'
              : 'Nahraný súbor musí byť vo formáte pdf.'}
          </span>
        )}
      </Box>
    </Stack>
  )
}
