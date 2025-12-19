import {FC} from 'react'
// eslint-disable-next-line no-restricted-imports -- tu je to validne
import {FileField, FileFieldProps, RecordContextProvider, useRecordContext} from 'react-admin'

type MyFileInputFileFieldProps = FileFieldProps & {
  existingFile?: {
    src: string
    title: string
  }
}

export const MyFileInputFileField: FC<MyFileInputFileFieldProps> = ({existingFile, ...rest}) => {
  // v Edite je FileField pouzity vnutri FileInput, ktory mu robi vlastni context, aby vedel, ci uz user pridal subor. takze record je bud:
  // - novy objekt {src: blob URL, title: filename}, ktory FileInput vytvoril po pridani suboru
  // - URL aktualneho suboru, ktoru vratil BE
  const record = useRecordContext()

  if (!record) return null

  // normalizujeme record na objekt, ktory ocakava FileField
  const normalizedRecord =
    typeof record === 'string' && existingFile
      ? // record je URL aktualneho suboru z BE -> pouzijeme existingFile, ktory sme si pripravili o uroven vyssie
        existingFile
      : // ked sa prave nahral novy subor -> record je objekt z FileInput contextu
        record

  return (
    <RecordContextProvider value={normalizedRecord}>
      <FileField {...rest} />
    </RecordContextProvider>
  )
}
