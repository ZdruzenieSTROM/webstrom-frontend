import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect} from 'react'

export const VerifyEmail: FC = () => {
  const router = useRouter()
  const {verificationKey} = router.query

  const {mutate: verifyEmail, isSuccess: isEmailVerified} = useMutation({
    mutationFn: (verificationKey: string) => axios.post('/api/user/registration/verify-email', {key: verificationKey}),
  })

  useEffect(() => {
    typeof verificationKey === 'string' && verifyEmail(verificationKey)
  }, [verificationKey, verifyEmail])

  return <>isEmailVerified = {String(isEmailVerified)}</>
}
