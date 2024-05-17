export interface Post {
  id?: number
  title: string
  body?: string
  tagList?: string[]
  article?: string
  slug?: string
  favorited: boolean
  favoritesCount: number
}

export interface User {
  username: string
  password: string
  email: string
  image?: string | undefined
}

export interface ArticleData {
  title: string
  description: string
  body: string
  tagList?: string[]
}

export interface UserDetails {
  email: string
  username: string
  token: string
  image: string
  bio: string
}

export interface PostsState {
  posts: Post[]
  currentPage: number
  isLoading: boolean
  articlesCount: number
  currentPost: any
  bio: string | null
}

export interface UserState {
  image: string | null
  name: string | null
  email: string | null
  loginError: boolean
  bio: string | null
  isLoading: boolean
}
