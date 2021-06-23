export interface MenuItemShort {
  id?: number
  caption: string
  url: string
}

export interface PostLink {
  id?: number
  caption: string
  url: string
}

export interface Post {
  id?: number
  links: PostLink[]
  caption: string
  short_text: string
  details?: string
  added_at?: string
  show_after: string
  disable_after: string
  sites: any[]
}
