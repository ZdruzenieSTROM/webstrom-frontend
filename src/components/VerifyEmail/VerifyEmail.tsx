import {Stack, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

import {Button} from '../Clickable/Button'
import {Dialog} from '../Dialog/Dialog'
import {Loading} from '../Loading/Loading'
import {LoginForm} from '../PageLayout/LoginForm/LoginForm'

export const VerifyEmail: FC = () => {
  const router = useRouter()
  const {verificationKey} = router.query

  const [displayAuthenticationDialog, setDisplayAuthenticationDialog] = useState(false)
  const toggleDisplayAuthenticationDialog = () => {
    setDisplayAuthenticationDialog((prev) => !prev)
  }

  const {
    mutate: verifyEmailMutate,
    isError,
    isSuccess: isVerified,
  } = useMutation({
    mutationFn: (verificationKey: string) => axios.post('/api/user/registration/verify-email', {key: verificationKey}),
  })

  useEffect(() => {
    typeof verificationKey === 'string' && verifyEmailMutate(verificationKey)
  }, [verificationKey, verifyEmailMutate])

  if (!isError && !isVerified) return <Loading />

  return (
    <>
      <Dialog open={displayAuthenticationDialog} close={toggleDisplayAuthenticationDialog} title="Prihlásenie">
        <LoginForm closeDialog={toggleDisplayAuthenticationDialog} />
      </Dialog>
      <Stack>
        {isError && (
          <Typography variant="body1">
            Email už bol verifikovaný, alebo nastal iný problém. Skús sa prihlásiť a v prípade problémov skús overiť
            email znovu alebo nás kontaktuj.
          </Typography>
        )}
        {isVerified && <Typography variant="body1">Overenie emailu prebehlo úspešne. Môžeš sa prihlásiť</Typography>}
        <Stack direction={'row'} mt={3} justifyContent="flex-end">
          <Button variant="button2" onClick={toggleDisplayAuthenticationDialog}>
            Prihlásiť
          </Button>
        </Stack>
      </Stack>
    </>
  )
}
