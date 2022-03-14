import {useRouter} from 'next/router'

export type Seminar = 'strom' | 'matik' | 'malynar'
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

// for admin purposes we need backwards mapping from seminar ID to seminar name
// need to use `number` signature instead of `SeminarId`
export const seminarIdToName = Object.entries(seminarToId).reduce<Record<number, Seminar>>(
  (acc, [seminar, seminarId]) => ((acc[seminarId] = seminar as Seminar), acc),
  {},
)
