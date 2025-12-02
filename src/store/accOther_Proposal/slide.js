import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listOtherProposal: [],
  detailOtherProposal: null,
  listReasonProposal: [],
  listCatalogue: [],
  detailCatalogue: null,
  listProgram: [],
  listEvent: [],
  listItems: [],
  listShowroom: [],
  detailShowroom: null,
  listProgramShowroom: []
};

export const otherProposalSlice = createSlice({
  name: 'otherProposal',
  initialState: initialState,
  reducers: {
    updateListOtherProposal: (state, action) => {
      state.listOtherProposal = action.payload;
    },
    updateDetailOtherProposal: (state, action) => {
      state.detailOtherProposal = action.payload;
    },
    updateListReasonProposal: (state, action) => {
      state.listReasonProposal = action.payload;
    },
    updateListCatalogue: (state, action) => {
      state.listCatalogue = action.payload;
    },
    updatedetailCatalogue: (state, action) => {
      state.detailCatalogue = action.payload;
    },
    updateListProgram: (state, action) => {
      state.listProgram = action.payload;
    },
    updateListEvent: (state, action) => {
      state.listEvent = action.payload;
    },
    updateListItem: (state, action) => {
      state.listItems = action.payload;
    },
    updateListShowroom: (state, action) => {
      state.listShowroom = action.payload;
    },
    updateDetailShowroom: (state, action) => {
      state.detailShowroom = action.payload;
    },
    updateListProgramShowroom: (state, action) => {
      state.listProgramShowroom = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListOtherProposal,
  updateDetailOtherProposal,
  updateListReasonProposal,
  setIsSubmitting,
  updateListCatalogue,
  updatedetailCatalogue,
  updateListEvent,
  updateListProgram,
  updateListItem,
  updateDetailShowroom,
  updateListShowroom,
  updateListProgramShowroom
} = otherProposalSlice.actions;

export default otherProposalSlice.reducer;
