import { setAppStatusAC } from "@/app/app-slice"
import { clearDataAC } from "@/common/actions"
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/common/constants"
import { createAppSlice, handleServerError } from "@/common/utils"
import { authApi } from "@/features/auth/api/authApi"
import type { LoginInputs } from "@/features/auth/lib/schemas"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          localStorage.setItem(AUTH_TOKEN, res.data.accessToken)
          localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken)
          return { isLoggedIn: true }
        } catch (error: any) {
          handleServerError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await authApi.logout()
          dispatch(setAppStatusAC({ status: "succeeded" }))
          dispatch(clearDataAC())
          localStorage.removeItem(AUTH_TOKEN)
          localStorage.removeItem(REFRESH_TOKEN)
          return { isLoggedIn: false }
        } catch (error: any) {
          handleServerError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    initializeAppTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await authApi.me()
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { isLoggedIn: true }
        } catch (error: any) {
          handleServerError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
  }),
})

export const { selectIsLoggedIn } = authSlice.selectors
export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions
export const authReducer = authSlice.reducer
