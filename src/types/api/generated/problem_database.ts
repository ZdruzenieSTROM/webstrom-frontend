export interface Seminar {
  id?: number
  name: string
}

export interface ActivityType {
  id?: number
  name: string
  seminar?: any
}

export interface Activity {
  id?: number
  date: string
  description: string
  soft_deleted?: boolean
  activity_type?: any
}

export interface Difficulty {
  id?: number
  name: string
  activity_type?: any
}

export interface Problem {
  id?: number
  problem: string
  result: string
  solution: string
  soft_deleted?: boolean
  problem_type: any[]
}

export interface Media {
  id?: number
  data: any
  soft_deleted?: boolean
  problem?: any
}

export interface ProblemActivity {
  id?: number
  problem?: any
  activity?: any
  difficulty?: any
}

export interface ProblemType {
  id?: number
  name: string
  description: string
  seminar?: any
}

export interface Tag {
  id?: number
  name: string
}

export interface ProblemTag {
  id?: number
  problem?: any
  tag?: any
}
