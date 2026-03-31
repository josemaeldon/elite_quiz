import { createSelector, createSlice } from '@reduxjs/toolkit'

// state
const initialState = {
  data: [],
  loading: false,
  lastFetch: null
}

// slice
export const userSlice = createSlice({
  name: 'WebSettings',
  initialState,
  reducers: {
    webSettingsRequested: (web, action) => {
      web.loading = true
    },
    webSettingsSuccess: (web, action) => {
      let { data } = action.payload
      web.data = data
      web.loading = false
      web.lastFetch = Date.now()
    },
    webSettingsFailed: (web, action) => {
      web.loading = false
    }
  }
})

export const { webSettingsRequested, webSettingsSuccess, webSettingsFailed } = userSlice.actions
export default userSlice.reducer

// selectors
export const selectUser = state => state.User

// Event listener to set manualRefresh flag when page is manually refreshed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('manualRefresh_WebSettings_Config', 'true')
  })

  window.addEventListener('load', () => {
    // Check if this is a manual refresh by checking if lastFetch is set
    if (!sessionStorage.getItem('lastFetch_WebSettings_Config')) {
      sessionStorage.setItem('manualRefresh_WebSettings_Config', 'true')
    }
  })
}

// Selector Functions
export const websettingsData = createSelector(
  state => state.WebSettings,
  WebSettings => WebSettings?.data
)
