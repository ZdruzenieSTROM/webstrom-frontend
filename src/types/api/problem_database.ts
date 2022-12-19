export interface Seminar {
  id: number
  name: string
}

export interface ActivityType {
  id: number
  name: string
  seminar?: number
}

export interface Activity {
  id: number
  date: string
  description: string
  soft_deleted: boolean
  activity_type: number
}

export interface Difficulty {
  id: number
  name: string
  activity_type: number
}

export interface Problem {
  id: number
  problem: string
  result: string
  solution: string
  soft_deleted: boolean
  problem_type: ProblemType[]
}

export interface Media {
  id: number
  data: string
  soft_deleted: boolean
  problem: number
}

export interface ProblemActivity {
  id: number
  problem: number
  activity: number
  difficulty: number
}

export interface ProblemType {
  id: number
  name: string
  description: string
  seminar: number
}

export interface Tag {
  id: number
  name: string
}

export interface ProblemTag {
  id: number
  problem: number
  tag: number
}
