import {Box} from '@mui/material'
import {FC} from 'react'

export const StromLogo: FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        // tieto cisla su take dost ad-hoc, ale aj tak ten strom nebude vidno
        top: {md: '204px', lg: '186px', xl: '222px'},
        left: 0,
        bottom: 0,
        width: '25%',
        paddingTop: 2,
        zIndex: -1,
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '100%',
          backgroundColor: 'black',
          // toto je stary tomaskov stromcek
          // clip-path: 'polygon(100% 0%, 100% 100%, 45% 100%, 96% 63%, 55% 63%, 96% 30%, 65% 30%)'
          // toto je novy stromcek od Matusa Libaka
          clipPath: 'polygon(100% 0, 100% 100%, 90% 100%, 90% 80%, 35% 80%, 90% 35%, 56% 35%)',
        }}
      />
    </Box>
  )
}
