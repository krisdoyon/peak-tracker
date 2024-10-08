import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export enum ModalType {
  WELCOME,
  LOGIN,
  UNSAVED_CHANGES,
  ERROR,
}

interface IModalState {
  openModal: ModalType | null;
  error: FetchBaseQueryError | SerializedError | undefined;
}

const initialState: IModalState = {
  openModal: null,
  error: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.openModal = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<FetchBaseQueryError | SerializedError | undefined>
    ) => {
      state.error = action.payload;
    },
    closeModal: (state) => {
      state.openModal = null;
    },
  },
});

export const { openModal, setError, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
