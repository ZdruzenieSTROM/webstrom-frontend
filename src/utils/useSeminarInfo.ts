import {useRouter} from 'next/router'

type Seminar = 'strom' | 'matik' | 'malynar'
type SeminarId = 0 | 1 | 2

const seminarToId: Record<Seminar, SeminarId> = {
  strom: 0,
  matik: 1,
  malynar: 2,
}

export const useSeminarInfo = () => {
  const router = useRouter()

  // e.g. gets "matik" from "/matik/zadania/[[...params]]"
  const seminar = router.pathname.slice(1).split('/', 1)[0] as Seminar
  const seminarId = seminarToId[seminar]

  return {seminar, seminarId}
}
