import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channel",
  initialState: null,
  reducers: {
    setChannel: (_, action) => {
      return action.payload;
    },
    editChannel: (state, action) => {
      return { ...state, ...action.payload };
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addLike: (state, action) => {
      const target = state.messages.find(
        (message) => message.id == action.payload.messageId
      );
      target.likes++;
      target.liked = action.payload.self;
    },
    removeLike: (state, action) => {
      const target = state.messages.find(
        (message) => message.id == action.payload.messageId
      );
      target.likes--;
      target.liked = !action.payload.self;
    },
  },
});

export const { setChannel, editChannel, addMessage, addLike, removeLike } =
  channelSlice.actions;
export default channelSlice.reducer;
