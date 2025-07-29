import { createSlice } from "@reduxjs/toolkit";

const serverSlice = createSlice({
  name: "server",
  initialState: null,
  reducers: {
    setServer: (_, action) => {
      return action.payload;
    },
    updateServer: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearServer: () => {
      return null;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    editChannel: (state, action) => {
      const index = state.channels.findIndex(
        (channel) => channel.name == action.payload.id
      );
      if (index !== -1) {
        delete action.payload.id;
        state.channels[index] = { ...state.channels[index], ...action.payload };
      }
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(
        (channel) => channel.name !== action.payload.id
      );
    },
    promoteMember: (state, action) => {
      const index = state.members.findIndex(
        (member) => member.id == action.payload.id
      );
      if (index !== -1) state.members[index].admin = true;
    },
    demoteMember: (state, action) => {
      const index = state.members.findIndex(
        (member) => member.id == action.payload.id
      );
      if (index !== -1) state.members[index].admin = false;
    },
  },
});

export const {
  setServer,
  updateServer,
  clearServer,
  addChannel,
  editChannel,
  removeChannel,
  promoteMember,
  demoteMember,
} = serverSlice.actions;

export default serverSlice.reducer;
