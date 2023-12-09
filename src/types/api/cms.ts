export interface MenuItemShort {
  id: number
  caption: string
  url: string
  in_footer: boolean
  in_menu: boolean
}

export interface PostLink {
  id: number
  caption: string
  url: string
}

export interface Post {
  id: number
  links: PostLink[]
  visible_after: string
  visible_until: string
  caption: string
  short_text: string
  details: string | null
  added_at: string
  sites: number[]
}

export interface InfoBanner {
  rendered_message: string
}

export interface MessageTemplate {
  message: string
}
