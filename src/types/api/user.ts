import {Profile} from './personal'

export interface Login {
  email: string | null
  password: string
}

export interface Token {
  key: string
}

export interface UserDetails {
  pk: number
  email?: string
  profile: Profile
}

export interface Register {
  email: string
  password1: string
  password2: string
  profile: Profile
  new_school_description: string | null
}
