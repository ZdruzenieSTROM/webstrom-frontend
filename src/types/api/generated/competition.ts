/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export interface Publication {
  id?: number
  name?: string
  file: any
  publication_type?: any | null
  event?: any | null
  order: number | null
}

export interface RegistrationLink {
  id?: number
  url: string
  start: string
  end: string
  additional_info: string | null
  event: any
}

export interface Event {
  id?: number
  can_participate?: any
  is_registered?: any
  publication_set: Publication[]
  registration_link: RegistrationLink
  year?: number
  school_year?: string
  season_code?: any
  start: string
  end: string
  additional_name?: string | null
  competition?: any | null
}

export interface CompetitionType {
  id?: number
  name: string
}

export interface Competition {
  id?: number
  competition_type: CompetitionType
  upcoming_or_current_event?: any
  history_events?: any
  name: string
  slug: string
  start_year?: number
  description?: string
  rules?: string | null
  who_can_participate?: string
  min_years_until_graduation?: number | null
  sites: any[]
  permission_group?: any[]
}

export interface EventRegistration {
  school: any
  grade?: any
  profile: any
}

export interface ProblemCorrection {
  corrected_by?: any
  best_solution?: any
}

export interface Problem {
  id: number
  submitted?: any
  num_solutions: number
  num_corrected_solutions: number
  text: string
  order: number
  image?: any | null
  series?: any
  solution_pdf?: string
}

export interface Comment {
  id?: number
  posted_by_name?: any
  edit_allowed?: any
  text: string
  posted_at?: string
  published: boolean
  problem: any
  posted_by: any
}

export interface Solution {
  id?: number
  solution?: any
  corrected_solution?: any
  score?: number | null
  vote?: any
  uploaded_at?: string
  is_online?: boolean
  problem: any
  semester_registration: any
  late_tag?: any | null
}

export interface SolutionAdministration {
  id: number
  corrected_solution?: any
  vote?: any
  late_tag?: any | null
  score?: number | null
  semester_registration?: EventRegistration
}

export interface ProblemWithSolutions {
  solution_set: SolutionAdministration[]
  text?: string
  order?: number
}

export interface Series {
  id?: number
  order: number
  deadline: string
  complete: boolean
  frozen_results?: string | null
  semester: any
}

export interface SeriesWithProblems {
  id: number
  can_participate?: any
  is_registered?: any
  problems: Problem[]
  can_submit?: any
  order: number
  deadline: string
  complete: boolean
  frozen_results?: string | null
  semester?: any
}

export interface Semester {
  id?: number
  series_set: Series[]
  year?: number
  school_year?: string
  season_code?: any
  start: string
  end: string
  additional_name?: string | null
  complete: boolean
  frozen_results?: string | null
  competition?: any | null
  late_tags?: any[]
}

export interface SemesterWithProblems {
  id?: number
  can_participate?: any
  is_registered?: any
  series_set: SeriesWithProblems[]
  publication_set: Publication[]
  year?: number
  school_year?: string
  season_code?: any
  start: string
  end: string
  additional_name?: string | null
  complete: boolean
  frozen_results?: string | null
  competition?: any | null
  late_tags?: any[]
}

export interface LateTag {
  id?: number
  name: string
  slug: string
  upper_bound: string
}

export interface Grade {
  id?: number
  name: string
  tag: string
  years_until_graduation: number
}
