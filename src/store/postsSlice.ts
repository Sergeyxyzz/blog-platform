import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ArticleData, Post, PostsState } from './interfaces'
import { PayloadAction } from '@reduxjs/toolkit'

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${(page - 1) * 5}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        },
      )
      const data = await response.json()
      return {
        articles: data.articles,
        articlesCount: data.articlesCount,
      }
    } catch {
      return rejectWithValue('Error get posts')
    }
  },
)

export const postPost = createAsyncThunk(
  'posts/postPost',
  async (postData: ArticleData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://blog.kata.academy/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ article: postData }),
      })
      const data = await response.json()
      return data.article
    } catch {
      return rejectWithValue('Error post post')
    }
  },
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (slug: string, { rejectWithValue }) => {
    try {
      await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
    } catch {
      return rejectWithValue('Error delete post')
    }
  },
)

export const editPost = createAsyncThunk(
  'posts/editPost',
  async ({ slug, payload }: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ article: payload }),
      })
      const data = await response.json()
      return data.article
    } catch {
      return rejectWithValue('Error edit post')
    }
  },
)

export const fetchPostBySlug = createAsyncThunk(
  'posts/fetchPostBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      return data
    } catch {
      return rejectWithValue('Error fetch post')
    }
  },
)

export const postLike = createAsyncThunk(
  'posts/postLike',
  async ({ slug, isLiked }: { slug: string; isLiked: boolean }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('Необходимо авторизоваться, чтобы ставить лайки.')
      }
      const method = isLiked ? 'DELETE' : 'POST'
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })
      const data = await response.json()
      return { data, slug, isLiked: !isLiked }
    } catch {
      return rejectWithValue('Error post like')
    }
  },
)

const initialState: PostsState = {
  posts: [],
  currentPage: 1,
  isLoading: false,
  articlesCount: 1,
  currentPost: null,
  bio: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload.articles
        state.articlesCount = action.payload.articlesCount
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action: PayloadAction<Post>) => {
        state.currentPost = action.payload
      })
      .addCase(postLike.fulfilled, (state, action) => {
        state.isLoading = false
        const { slug, isLiked, data } = action.payload
        if (state.currentPost?.article?.slug === slug) {
          state.currentPost.article.favorited = isLiked
          state.currentPost.article.favoritesCount = data.article.favoritesCount
        }
        const index = state.posts.findIndex((post) => post.slug === slug)
        if (index !== -1) {
          state.posts[index].favorited = isLiked
          state.posts[index].favoritesCount = data.article.favoritesCount
        }
      })
  },
})

export const { setCurrentPage } = postsSlice.actions
export default postsSlice.reducer
