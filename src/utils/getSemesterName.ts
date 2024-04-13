import {Semester} from '@/types/api/competition'

export const getSemesterName = (semester: Semester) =>
  `${semester.season_code === 0 ? 'zimný' : 'letný'} ${' semester'}`
