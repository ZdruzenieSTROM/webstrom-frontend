export interface Login {
  email?: string
  password: string
}

export interface Token {
  key: string
}

export interface UserDetails {
  pk?: number
  email?: string
  profile: any
}

export interface Register {
  email: string
  password1: string
  password2: string
  profile: any
  new_school_description: string
}
