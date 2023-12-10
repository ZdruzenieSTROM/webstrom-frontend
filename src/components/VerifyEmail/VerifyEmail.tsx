import {Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect} from 'react'

import {Loading} from '../Loading/Loading'
import {LoginForm} from '../PageLayout/LoginForm/LoginForm'

export const VerifyEmail: FC = () => {
  const router = useRouter()
  const {verificationKey} = router.query

  const {
    mutate: verifyEmail,
    isError: isError,
    isSuccess: isVerified,
  } = useMutation({
    mutationFn: (verificationKey: string) => axios.post('/api/user/registration/verify-email', {key: verificationKey}),
  })

  useEffect(() => {
    typeof verificationKey === 'string' && verifyEmail(verificationKey)
  }, [verificationKey, verifyEmail])

  if (isError)
    return (
      <Typography variant="body1">
        Email už bol verifikovaný, alebo nastal iný problém. Skús sa prihlásiť a v prípade problémov skús overiť email
        znovu alebo nás kontaktuj.
      </Typography>
    )
  if (isVerified)
    return (
      <>
        <Typography variant="body1">Pre dokončenie overenia emailu sa prihlás</Typography>
        <LoginForm
          closeDialog={() => {
            router.push('/')
          }}
        />
      </>
    )
  return <Loading />
}
