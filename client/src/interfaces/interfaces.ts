export interface Park {
  parkCode?: string,
  type?: string,
  fullName?: string,
  url?: string
}

export interface Json extends Object{
  data?: Object[],
  parkName: Park
}

export interface Article{
  parkName?: string,
  title?: string,
  url?: string,
  parkCode?: string,
  releaseDate?: string 
  abstract?: string,
  image?: {
    url?: string,
    caption?: string,
    altText?: string
  },
  relatedParks?: Park[]
} 

export type ViewToggle = 'rows' | 'card'

export type NewsToggle = 'recent' | 'park'

export interface NewsType {
  type: 'recent' | 'park'
}