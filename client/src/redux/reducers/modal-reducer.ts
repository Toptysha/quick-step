import { ReduxStore } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ReduxStore["modal"] = {
  isOpen: false,
  content: null,
  disableOverlayClose: false,
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action) {
      state.isOpen = true;
      state.content = action.payload.content;
      state.disableOverlayClose = action.payload.disableOverlayClose || false;
    },
    closeModal(state) {
      state.isOpen = false;
      state.content = null;
      state.disableOverlayClose = false;
    },
  },
});

export const { openModal, closeModal } = ModalSlice.actions;

export default ModalSlice.reducer;