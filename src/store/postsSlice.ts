import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ArticleData, Post, PostResponse, PostsState } from './interfaces'
import { PayloadAction } from '@reduxjs/toolkit'

export const fetchPost = createAsyncThunk<
  PostResponse,
  number,
  {
    rejectValue: string
  }
>('posts/fetchPost', async (page, { rejectWithValue }) => {
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
    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message)
    }
    const data = await response.json()
    return {
      articles: data.articles,
      articlesCount: data.articlesCount,
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    } else {
      return rejectWithValue('Error')
    }
  }
})

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
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message)
      }
      const data = await response.json()
      return data.article
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('Error')
      }
    }
  },
)

export const deletePost = createAsyncThunk<
  void,
  string,
  {
    rejectValue: string
  }
>('posts/deletePost', async (slug, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'Ошибка удаления статьи.')
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    } else {
      return rejectWithValue('Error')
    }
  }
})

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
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message)
      }
      const data = await response.json()
      return data.article
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('Error')
      }
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
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message)
      }
      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('Error')
      }
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
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message)
      }
      const data = await response.json()
      return { data, slug, isLiked: !isLiked }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('Error')
      }
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
  error: null,
  loadingLike: false,
  idErrorPost: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload
    },
    clearError(state) {
      state.error = null
    },
    clearPost(state) {
      state.currentPost = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.isLoading = true
        state.idErrorPost = ''
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload.articles
        state.idErrorPost = ''
        state.articlesCount = action.payload.articlesCount
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Ошибка получения постов'
      })
      .addCase(fetchPostBySlug.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action: PayloadAction<Post>) => {
        state.isLoading = false
        state.currentPost = action.payload
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.idErrorPost = 'Поста с таким id не существует'
        state.error = action.payload || 'Ошибка получения поста по id'
      })
      .addCase(postLike.pending, (state) => {
        state.loadingLike = true
      })
      .addCase(postLike.fulfilled, (state, action) => {
        state.isLoading = false
        state.loadingLike = false
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
      .addCase(postLike.rejected, (state, action) => {
        state.isLoading = false
        state.loadingLike = false
        state.error = action.payload || 'Ошибка проставления лайка'
      })
      .addCase(postPost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postPost.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(postPost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Ошибка отправки поста'
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Ошибка удаления поста'
      })
      .addCase(editPost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Ошибка редактирования поста'
      })
  },
})

export const { setCurrentPage, clearError, clearPost } = postsSlice.actions
export default postsSlice.reducer
