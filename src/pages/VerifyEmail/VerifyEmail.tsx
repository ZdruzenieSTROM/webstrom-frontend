import axios, {AxiosError} from 'axios'
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

interface IUseParam {
  verificationKey: string
}

export const VerifyEmail: React.FC = () => {
  const {verificationKey} = useParams<IUseParam>()
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
