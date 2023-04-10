import {Upload} from '@mui/icons-material'
import axios from 'axios'
import clsx from 'clsx'
import NextLink from 'next/link'
import {FC, ReactNode, useCallback} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import styles from './Clickable.module.scss'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
}

export const Button: FC<ButtonProps> = ({children, onClick, disabled}) => {
  return (
    <span onClick={onClick} className={clsx(styles.actionButton, disabled && styles.disabled)}>
      {children}
    </span>
  )
}

interface LinkProps {
  href: string
  disabled?: boolean
  children: ReactNode
}

export const Link: FC<LinkProps> = ({children, href, disabled}) => {
  return (
    <NextLink href={href} className={clsx(styles.actionButton, disabled && styles.disabled)}>
      {children}
    </NextLink>
  )
}

interface FileUploaderProps {
  uploadLink: string
  refetch: () => void
}

export const FileUploader: FC<FileUploaderProps> = ({uploadLink, refetch}) => {
  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles) => {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      await axios.post(uploadLink, formData)
      await refetch()
    },
    [refetch, uploadLink],
  )

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Upload />
      </div>
    </>
  )
}
