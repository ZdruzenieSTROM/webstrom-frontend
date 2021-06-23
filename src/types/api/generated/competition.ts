export interface UnspecifiedPublication {
  id?: number
  name?: string
  file: any
  event?: any | null
}

export interface SemesterPublication {
  id?: number
  name?: string
  order: number
  file: any
  thumbnail?: any
  semester?: any | null
}

export interface RegistrationLink {
  id?: number
  url: string
  start: string
  end: string
  additional_info: string
  event: any
}

export interface Event {
  id?: number
  unspecifiedpublication_set: UnspecifiedPublication[]
  registration_links: RegistrationLink[]
  year?: number
  school_year?: string
  start: string
  end: string
  competition?: any | null
}

export interface Competition {
  id?: number
  event_set: Event[]
  name: string
  start_year?: number
  description?: string
  rules?: string | null
  competition_type: any
  min_years_until_graduation?: number | null
  sites: any[]
  permission_group?: any[]
}

export interface EventRegistration {
  school: any
  grade?: any
  profile: any
}

export interface Problem {
  id?: number
  text: string
  order: number
  series?: any
}

export interface Comment {
  id?: number
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

export interface Series {
  id?: number
  order: number
  deadline: string
  complete: boolean
  frozen_results?: string | null
  semester: any
}

export interface SeriesWithProblems {
  id?: number
  problems: Problem[]
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
  start: string
  end: string
  season_code: any
  frozen_results?: string | null
  competition?: any | null
  late_tags?: any[]
}

export interface SemesterWithProblems {
  id?: number
  series_set: SeriesWithProblems[]
  semesterpublication_set: SemesterPublication[]
  unspecifiedpublication_set: UnspecifiedPublication[]
  year?: number
  school_year?: string
  start: string
  end: string
  season_code: any
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
