import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  sdgGoalNumber: "",
  description: "",
  endDate: "",
  location: {
    locationName: "",
    latitude: null,
    longitude: null,
  },
  coverImage: {
    secure_url: "",
    public_id: "",
  },
  financialBreakdown: [
    {
      itemName: "",
      cost: "",
      description: "",
    },
  ],
};

const campaignUpdateSlice = createSlice({
  name: "campaignUpdate",
  initialState,
  reducers: {
    setCampaignUpdateForm(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    updateCampaignUpdateField(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },

    updateCampaignUpdateLocation(state, action) {
      state.location = action.payload;
    },

    updateCampaignUpdateFinancialItem(state, action) {
      const { index, field, value } = action.payload;
      state.financialBreakdown[index][field] = value;
    },

    addCampaignUpdateFinancialItem(state) {
      state.financialBreakdown.push({
        itemName: "",
        cost: "",
        description: "",
      });
    },

    removeCampaignUpdateFinancialItem(state, action) {
      state.financialBreakdown = state.financialBreakdown.filter(
        (_, index) => index !== action.payload
      );
    },

    resetCampaignUpdateForm() {
      return initialState;
    },
  },
});

export const {
  setCampaignUpdateForm,
  updateCampaignUpdateField,
  updateCampaignUpdateLocation,
  updateCampaignUpdateFinancialItem,
  addCampaignUpdateFinancialItem,
  removeCampaignUpdateFinancialItem,
  resetCampaignUpdateForm,
} = campaignUpdateSlice.actions;

export default campaignUpdateSlice.reducer;