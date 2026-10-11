import {
  Problem,
  ProblemWithSolutions,
  Semester,
  SemesterWithProblems,
  Series,
  SeriesWithProblems,
  Solution,
  SolutionAdministration,
} from '@/types/api/competition'
import {Profile} from '@/types/api/personal'

export const makeProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: 1,
  user_id: 1,
  first_name: 'Jana',
  last_name: 'Riešiteľová',
  email: 'riesitel@example.com',
  nickname: null,
  school: {
    code: 100,
    district: {code: 802, name: 'Košice I', abbreviation: 'KE', county: 8},
    verbose_name: 'Gymnázium, Poštová 9, Košice',
  },
  other_school_info: null,
  phone: null,
  parent_phone: null,
  gdpr: true,
  grade: 4,
  grade_name: '9. ročník ZŠ',
  is_student: true,
  has_school: true,
  school_id: 100,
  ...overrides,
})

export const makeSeries = (overrides: Partial<Series> = {}): Series => ({
  id: 30,
  order: 1,
  deadline: '2099-01-01T20:00:00+01:00',
  complete: false,
  frozen_results: null,
  semester: 20,
  ...overrides,
})

export const makeSemester = (overrides: Partial<Semester> = {}): Semester => ({
  id: 20,
  series_set: [makeSeries()],
  year: 50,
  school_year: '2025/2026',
  season_code: 0,
  start: '2025-09-01T00:00:00+02:00',
  end: '2099-01-31T00:00:00+01:00',
  additional_name: null,
  frozen_results: null,
  competition: 0,
  late_tags: [],
  ...overrides,
})

export const makeSubmittedSolution = (overrides: Partial<Solution> = {}): Solution => ({
  id: 500,
  solution: '/media/solutions/riesenie.pdf',
  corrected_solution: null,
  score: null,
  vote: null,
  uploaded_at: '2025-10-01T12:00:00+02:00',
  is_online: true,
  problem: 101,
  semester_registration: 700,
  late_tag: null,
  ...overrides,
})

export const makeProblem = (overrides: Partial<Problem> = {}): Problem => ({
  id: 101,
  submitted: null,
  num_solutions: 0,
  num_corrected_solutions: 0,
  text: 'Nájdi všetky prvočísla menšie ako 20.',
  order: 1,
  image: null,
  series: 30,
  num_comments: 0,
  solution_pdf: null,
  ...overrides,
})

export const makeSeriesWithProblems = (overrides: Partial<SeriesWithProblems> = {}): SeriesWithProblems => ({
  ...makeSeries(),
  can_participate: true,
  is_registered: false,
  can_submit: true,
  can_resubmit: true,
  problems: [makeProblem()],
  ...overrides,
})

export const makeSemesterWithProblems = (overrides: Partial<SemesterWithProblems> = {}): SemesterWithProblems => ({
  ...makeSemester(),
  can_participate: true,
  is_registered: false,
  series_set: [makeSeriesWithProblems()],
  publication_set: [],
  complete: false,
  ...overrides,
})

export const makeSolutionAdministration = (
  overrides: Partial<SolutionAdministration> = {},
): SolutionAdministration => ({
  id: 1,
  score: null,
  vote: null,
  late_tag: null,
  is_online: true,
  solution: null,
  corrected_solution: null,
  semester_registration: {
    id: 700,
    school: {
      code: 100,
      name: 'Gymnázium',
      abbreviation: 'GPoš',
      street: 'Poštová 9',
      city: 'Košice',
      zip_code: '04001',
    },
    grade: {id: 4, name: '9. ročník ZŠ', tag: 'Z9', years_until_graduation: 4},
    profile: {id: 1, first_name: 'Test', last_name: 'User'},
    verbose_name: 'Test User',
    event: 20,
  },
  ...overrides,
})

export const makeProblemWithSolutions = (overrides: Partial<ProblemWithSolutions> = {}): ProblemWithSolutions => ({
  order: 1,
  text: 'Test problem',
  image: null,
  solution_pdf: null,
  series: makeSeries(),
  solution_set: [],
  ...overrides,
})
