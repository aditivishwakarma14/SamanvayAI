import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",

  initialState: {
    conversations: [],
    selectedConversation: null,
  },

  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },

    setConversationTitle: (state, action) => {
      const { title, conversationId } = action.payload;

      // Sirf jis conversation ki ID match kare,
      // usi ka title change hoga
      state.conversations = state.conversations.map((conv) =>
        conv._id === conversationId
          ? { ...conv, title }
          : conv
      );

      // Selected conversation ka title bhi update karo
      if (
        state.selectedConversation &&
        state.selectedConversation._id === conversationId
      ) {
        state.selectedConversation = {
          ...state.selectedConversation,
          title,
        };
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  setConversationTitle,
} = conversationSlice.actions;

export default conversationSlice.reducer;