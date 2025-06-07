import {Box} from '@mui/material'
import {FC} from 'react'
import {DropzoneInputProps, DropzoneRootProps} from 'react-dropzone'

interface FileDropZoneProps {
  text: string
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

export const FileDropZone: FC<FileDropZoneProps> = ({text, getRootProps, getInputProps}) => {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        color: '#BBB',
        bgcolor: '#EEE',
        border: '2px solid black',
        ':hover': {
          bgcolor: '#DDD',
        },
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p>{text}</p>
    </Box>
  )
}
