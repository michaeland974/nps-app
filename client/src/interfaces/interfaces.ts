export interface Park {
  parkCode?: string,
  type?: string,
  fullName?: string,
  url?: string
}

export interface JSON extends Object{
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

export interface ParkState {
  options: string[][],
  newsDisplay: {
    selected: Article[] | [],
    recent: Article[],
    previous: Article[]
  }
}
export type ParkStateKeys = keyof ParkState | keyof ParkState['newsDisplay']

export type InputState = Record<'value' | 'code' | 'view', string>

