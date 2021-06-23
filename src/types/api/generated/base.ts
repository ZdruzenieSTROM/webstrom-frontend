export interface FlatPage {
  id?: number
  url: string
  title: string
  content?: string
  enable_comments?: boolean
  template_name?: string
  registration_required?: boolean
  sites: any[]
}
