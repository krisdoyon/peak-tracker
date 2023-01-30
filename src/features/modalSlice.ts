import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ModalType {
  WELCOME,
  LOGIN,
}

interface IModalState {
  openModal: null | ModalType;
}

const initialState: IModalState = {
  openModal: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.openModal = action.payload;
    },
    closeModal: (state) => {
      state.openModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
