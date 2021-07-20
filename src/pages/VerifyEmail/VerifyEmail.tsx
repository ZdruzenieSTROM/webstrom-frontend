import axios, {AxiosError} from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

export const VerifyEmail: FC = () => {
  const router = useRouter()
  const {verificationKey} = router.query
  const [response, setResponse] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.post('/api/user/registration/verify-email/', {key: verificationKey})
        const response =
          data.status === 200 ? 'Email successfully verified' : 'An unexpected response status code has occurred'
        setResponse(response)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Wrong verification key' : 'An unexpected error has occurred'
        setResponse(error)
      }
    }
    fetchData()
  }, [verificationKey])

  return <>{response}</>
}
