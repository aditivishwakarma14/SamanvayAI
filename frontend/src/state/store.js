import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice.js"
import conversationReducer from "./slices/conversation.slice.js"
import messageReducer from "./slices/messageSlice.js"

export const store = configureStore({
  reducer: {
      user : userReducer ,
      conversation : conversationReducer ,
      message : messageReducer
  },
})

