import {ProfileShort, SchoolShort} from './personal'

export type IGrade = {
  id: number
  name: string
  tag: string
  years_until_graduation: number
}

export interface Publication {
  id: number
  name: string | null
  file: string
  publication_type: number | null
  event: number | null
  order: number | null
}

export interface RegistrationLink {
  id: number
  url: string
  start: string
  end: string
  additional_info: string
  event: Event
}

export interface Event {
  id: number
  can_participate: boolean
  is_registered: boolean
  publication_set: Publication[]
  registration_link: RegistrationLink
  year: number | null
  school_year: string | null
  season_code: number
  start: string
  end: string
  additional_name: string | null
  competition: number | null
}

export interface CompetitionType {
  id: number
  name: string
}

export interface Competition {
  id: number
  competition_type: CompetitionType | null
  upcoming_or_current_event: Event | null
  history_events: Event[]
  name: string
  slug: string
  start_year: number | null
  description: string | null
  rules: string | null
  who_can_participate: string | null
  min_years_until_graduation: number | null
  sites: number[]
  permission_group: number[] | null
}

export interface EventRegistration {
  school: SchoolShort
  grade: string
  profile: ProfileShort
}

export interface ProblemCorrection {
  corrected_by: string[]
  best_solution: string[]
}

export interface Problem {
  id: number
  submitted?: Solution
  text: string
  order: number
  image: string | null
  series: number
  num_comments: number
  solution_pdf: string | null
}

export enum CommentState {
  WaitingForReview = 1,
  Published = 2,
  Hidden = 3,
}
export interface Comment {
  id: number
  posted_by_name: string
  edit_allowed: boolean
  text: string
  posted_at: string
  state: CommentState
  hidden_response: string | null
  problem: number
  posted_by: number
}

export interface Solution {
  id: number
  solution: string | null
  corrected_solution: string | null
  score: number | null
  vote: number | null
  uploaded_at: string
  is_online: boolean
  problem: number
  semester_registration: number
  late_tag: number | null
}

export interface SolutionAdministration {
  id: number
  corrected_solution?: string | null
  solution?: string | null
  vote: number | null
  late_tag: number | null
  score: number | null
  semester_registration?: EventRegistration
  is_online: boolean
}

export interface ProblemWithSolutions {
  solution_set: SolutionAdministration[]
  text?: string
  order?: number
  correction?: ProblemCorrection
  series: Series
  solution_pdf: string | null
}

export interface Series {
  id: number
  order: number
  deadline: string
  complete: boolean
  frozen_results: string | null
  semester: number
}

export interface SeriesWithProblems {
  id: number
  can_participate: boolean
  is_registered: boolean
  problems: Problem[]
  can_submit: boolean
  can_resubmit: boolean
  order: number
  deadline: string
  complete: boolean
  frozen_results: string | null
  semester?: number
}

export interface Semester {
  id: number
  series_set: Series[]
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  additional_name: string | null
  frozen_results: string | null
  competition: number
  late_tags: number[]
}

export interface SemesterWithProblems {
  id: number
  can_participate: boolean
  is_registered: boolean
  series_set: SeriesWithProblems[]
  publication_set: Publication[]
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  additional_name: string | null
  frozen_results: string | null
  competition: number
  late_tags: number[]
}

export interface LateTag {
  id: number
  name: string
  slug: string
  upper_bound: string
}

export interface Grade {
  id: number
  name: string
  tag: string
  years_until_graduation: number
}
