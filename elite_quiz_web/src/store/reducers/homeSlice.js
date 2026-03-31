import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {},
  loading: false,
  lastFetch: null,
  Lang: null
}

export const slice = createSlice({
  name: 'Home',
  initialState,
  reducers: {
    homeRequested: home => {
      home.loading = true
    },
    homeReceived: (home, action) => {      
      home.data = action.payload.data
      home.loading = false
      home.lastFetch = Date.now()
    },
    homeRequestFailed: (home, action) => {
      home.data = action.payload.message
      home.loading = true
    },
    homeUpdateLanguage: (home, action) => {
      if (!home.Lang) {
        home.Lang = { language_id: action.payload }
      } else {
        home.Lang.language_id = action.payload
      }
    }
  }
})

export const { homeRequested, homeReceived, homeRequestFailed, homeUpdateLanguage } = slice.actions
export default slice.reducer


// Selector Functions
export const selectHome = createSelector(
  state => state.Home,
  Home => Home
)
