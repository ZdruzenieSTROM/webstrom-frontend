export type ISchool = {
  code: number
  name: string
  abbreviation: string
  street: string
  city: string
  zip_code: string
  email: string
  district: number
}

export type ICounty = {
  code: number
  name: string
}

export type IDistrict = {
  code: number
  name: string
  abbreviation: string
  county: number
}

export interface County {
  code: number
  name: string
}

export interface District {
  code: number
  name: string
  abbreviation: string
  county: number
}

export interface School {
  code: number
  name: string
  abbreviation: string
  street: string
  city: string
  zip_code: string
  email: string | null
  district: number
}

export interface SchoolShort {
  code: number
  name: string
  abbreviation: string
  street: string
  city: string
  zip_code: string
}

export interface SchoolProfile {
  code: number
  district: District
  verbose_name: string
}

export interface Profile {
  id: number
  first_name: string
  last_name: string
  email: string
  nickname: string | null
  school: SchoolProfile
  phone: string | null
  parent_phone: string | null
  gdpr: boolean
  grade: number
  grade_name: string
  is_student: boolean
  has_school: boolean
  school_id: number
}

export interface MyPermissions {
  is_staff: boolean
  competition_permissions: number[]
}

export interface ProfileCreate {
  first_name: string
  last_name: string
  nickname: string | null
  school: SchoolProfile
  phone: string | null
  parent_phone: string | null
  gdpr: boolean
  grade: number
}

export interface ProfileShort {
  first_name: string
  last_name: string
  nickname: string | null
}

export interface ProfileMail {
  first_name: string
  last_name: string
  nickname: string | null
  email: string
}
