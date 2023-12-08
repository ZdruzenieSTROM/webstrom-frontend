import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect} from 'react'
import {LoginForm} from '../PageLayout/LoginForm/LoginForm'

export const VerifyEmail: FC = () => {
  const router = useRouter()
  const {verificationKey} = router.query

  const {mutate: verifyEmail, isSuccess: isEmailVerified} = useMutation({
    mutationFn: (verificationKey: string) => axios.post('/api/user/registration/verify-email', {key: verificationKey}),
  })

  useEffect(() => {
    typeof verificationKey === 'string' && verifyEmail(verificationKey)
  }, [verificationKey, verifyEmail])


  if (!isEmailVerified)
    return <>I am a temporary email verification error. Please put me out of my misery.</>

  return (
    <>
      <p>Pre dokončenie overenia emailu sa prihláste</p>
      <LoginForm closeOverlay={()=>{ router.push("/") }}/>
    </>
  )
}
