import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  total: 0,
}

export const notificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    notificationSuccess: (notification, action) => {
      // let old = notification.data ? JSON.parse(JSON.stringify(notification.data)) : { data: [] };
      // old.data = [...old.data, ...action.payload.data]
      // notification.data = old
       // Clone the existing data
       let oldData = notification.data ? JSON.parse(JSON.stringify(notification.data)) : { data: [] };

       // Check if incoming data contains items not already present in the existing data
       let newData = action.payload.data.filter(newItem => {
         return !oldData.data.some(oldItem => oldItem.id === newItem.id); // Assuming each item has a unique identifier like 'id'
       });
 
       // Append only the new data to the existing data
       oldData.data = [...oldData.data, ...newData];
 
       // Update the state with the merged data
       notification.data = oldData;
    },
    updateTotal:(notification,action) => {
      notification.total = action.payload
    },
    notificationClear: (notification) => {
      notification.data = null;
      notification.total = 0;
    }
  }
})

export const { notificationSuccess,updateTotal,notificationClear } = notificationSlice.actions
export default notificationSlice.reducer



// Selector Functions
export const notificationData = createSelector(
  state => state.Notification,
  Notification => Notification.data
)

export const notifiationTotal = createSelector(
  state => state.Notification,
  Notification => Notification.total
)
