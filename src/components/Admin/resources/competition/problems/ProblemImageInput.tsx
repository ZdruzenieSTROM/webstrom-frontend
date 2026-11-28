import {fromEvent} from 'file-selector'
import {useRef} from 'react'
import {ImageInput, useNotify} from 'react-admin'
import type {DropzoneOptions} from 'react-dropzone'

import {MyImageField} from '@/components/Admin/custom/MyImageField'
import {Accept} from '@/utils/dropzoneAccept'

const accept = {...Accept.Image, ...Accept.Pdf}

interface ProblemImageInputProps {
  converting: boolean
  setConverting: (converting: boolean) => void
}

export const ProblemImageInput = ({converting, setConverting}: ProblemImageInputProps) => {
  const notify = useNotify()
  const conversionInProgress = useRef(false)

  const getFilesFromEvent: NonNullable<DropzoneOptions['getFilesFromEvent']> = async (event) => {
    const files = await fromEvent(event).catch((error: unknown) => {
      throw new Error('Súbor sa nepodarilo načítať. Skús ho vybrať znova.', {cause: error})
    })
    if (!Array.isArray(event) && event.type !== 'drop' && event.type !== 'change') return files
    if (conversionInProgress.current) throw new DOMException('Conversion in progress', 'AbortError')
    if (files.length !== 1) throw new Error('Vyber jeden súbor.')

    const [file] = files
    if (!(file instanceof File) || (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name))) return files

    conversionInProgress.current = true
    setConverting(true)
    try {
      const {renderPdfAsPng} = await import('@/utils/renderPdfAsPng')
      const image = await renderPdfAsPng(file)
      if (image) return [image]
    } catch {
      throw new Error('PDF sa nepodarilo previesť na obrázok. Skús nahrať iné PDF, JPG alebo PNG.')
    } finally {
      conversionInProgress.current = false
      setConverting(false)
    }
    throw new Error('Nahraj PDF s jednou stranou.')
  }

  return (
    <ImageInput
      source="image"
      accept={accept}
      helperText={converting ? 'Prebieha prevod PDF na obrázok…' : 'Nahraj JPG, PNG alebo jednostranové PDF.'}
      options={{
        disabled: converting,
        getFilesFromEvent,
        onError: (error) => {
          if (error.name !== 'AbortError') notify(error.message, {type: 'error'})
        },
      }}
      validateFileRemoval={() => {
        if (conversionInProgress.current) throw new Error('Conversion in progress')
        return true
      }}
    >
      <MyImageField />
    </ImageInput>
  )
}
