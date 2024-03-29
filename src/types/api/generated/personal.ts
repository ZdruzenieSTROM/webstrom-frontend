export interface County {
  code?: number
  name: string
}

export interface District {
  code?: number
  name: string
  abbreviation: string
  county: any
}

export interface School {
  code?: number
  name: string
  abbreviation: string
  street: string
  city: string
  zip_code: string
  email?: string
  district: any
}

export interface SchoolShort {
  code?: number
  name: string
  abbreviation: string
  street: string
  city: string
  zip_code: string
}

export interface SchoolProfile {
  code?: number
  district: District
  verbose_name?: any
}

export interface Profile {
  first_name?: string
  last_name?: string
  nickname?: string
  school?: SchoolProfile
  phone?: string
  parent_phone?: string
  gdpr?: boolean
  grade: number
  is_student?: any
  has_school?: any
  school_id: number
}

export interface ProfileCreate {
  first_name: string
  last_name: string
  nickname?: string
  school: any
  phone?: string
  parent_phone?: string
  gdpr?: boolean
  grade: number
}

export interface ProfileShort {
  first_name: string
  last_name: string
  nickname?: string
}

export interface ProfileMail {
  first_name: string
  last_name: string
  nickname?: string
  email: string
}
