import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserState } from './interfaces'
import { saveUserData } from '../functions'
import avaImageStatic from '../assets/ava.jpg'
import { UserDetails } from './interfaces'

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: User, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('https://blog.kata.academy/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ user: userData }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.errors)
      }

      dispatch(setUserDetails(data.user))
      return data.user
    } catch (error) {
      return rejectWithValue('error')
    }
  },
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData: User, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('https://blog.kata.academy/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ user: userData }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.errors)
      }

      dispatch(setUserDetails(data.user))
      return data.user
    } catch (error) {
      return rejectWithValue('error')
    }
  },
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: User, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('https://blog.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ user: userData }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.errors)
      }

      dispatch(setUserDetails(data.user))
      return data.user
    } catch (error) {
      return rejectWithValue('error')
    }
  },
)

const initialState: UserState = {
  image: localStorage.getItem('image') || avaImageStatic,
  name: localStorage.getItem('username') || null,
  email: localStorage.getItem('email') || null,
  loginError: false,
  isLoading: false,
  bio: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut(state) {
      localStorage.clear()
      state.email = null
      state.name = null
      state.image = null
      state.loginError = false
    },
    setUserDetails(state, action: PayloadAction<UserDetails>) {
      const { email, username, token, image, bio } = action.payload
      saveUserData({ email, username, token, image })
      state.email = email
      state.name = username
      state.image = image
      state.bio = bio
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.name = action.payload.username
        state.email = action.payload.email
        state.image = action.payload.image
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.email = action.payload.email
        state.image = action.payload.image
        state.name = action.payload.username
      })
      .addCase(loginUser.rejected, (state) => {
        state.loginError = false
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.name = action.payload.username
        state.image = action.payload.image
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const { logOut, setUserDetails } = userSlice.actions
export default userSlice.reducer
