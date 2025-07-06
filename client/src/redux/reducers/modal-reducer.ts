import { ReduxStore } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ReduxStore["modal"] = {
  isOpen: false,
  content: null,
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action) {
      state.isOpen = true;
      state.content = action.payload.content;
    },
    closeModal(state) {
      state.isOpen = false;
      state.content = null;
    },
  },
});

export const { openModal, closeModal } = ModalSlice.actions;

export default ModalSlice.reducer;