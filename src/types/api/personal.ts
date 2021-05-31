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
