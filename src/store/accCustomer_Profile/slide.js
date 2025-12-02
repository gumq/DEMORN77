import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  detailCustomer: null,
  listCustomerType: [],
  listBanks: [],
  listCustomerGroup: [],
  listHonorifics: [],
  listPricingCriteria: [],
  listResponsibilities: [],
  listBusinessRegistrationType: [],
  listBusinessDomain: [],
  listNation: [],
  listPostalCode: [],
  listSalesOrganization: [],
  listSalesChannel: [],
  listBankTransferMethod: [],
  listParentSalesRoutes: [],
  listChildrenSalesRoutes: [],
  listSalesTeam: [],
  listSalesSubTeam: [],
  listProvinceCity: [],
  listWardCommune: [],
  listRecordingChannel: [],
  listPositions: [],
  listWarehouse: [],
  listImportPort: [],
  listExportPort: [],
  listReceivingForm: [],
  listProductTypes: [],
  listCustomerOfficalSupport: [],
  listCustomerClassification: [],
  listBusinessType: [],
  listPartnerType: [],
  listPartnerGroup: [],
  detailUserID: null,
  listAddress: [],
  listItemTypes: [],
  listVBH: [],
  listWarehouseMD: [],
  listVungSAP: [],
  listBankKey: [],
  listTermsOfPayment: [],
  listfactory: [],
};

export const customerProfileSlice = createSlice({
  name: 'customerProfile',
  initialState: initialState,
  reducers: {
    updateListfactory: (state, action) => {
      state.listfactory = action.payload;
    },
    updateDetailCustomer: (state, action) => {
      state.detailCustomer = action.payload;
    },
    updateListCustomerType: (state, action) => {
      state.listCustomerType = action.payload;
    },
    updateListBanks: (state, action) => {
      state.listBanks = action.payload;
    },
    updateListCustomerGroup: (state, action) => {
      state.listCustomerGroup = action.payload;
    },
    updateListHonorifics: (state, action) => {
      state.listHonorifics = action.payload;
    },
    updateListResponsibilities: (state, action) => {
      state.listResponsibilities = action.payload;
    },
    updateListBusinessRegistrationType: (state, action) => {
      state.listBusinessRegistrationType = action.payload;
    },
    updateListBusinessDomain: (state, action) => {
      state.listBusinessDomain = action.payload;
    },
    updateListNation: (state, action) => {
      state.listNation = action.payload;
    },
    updateListPostalCode: (state, action) => {
      state.listPostalCode = action.payload;
    },
    updateListSalesChannel: (state, action) => {
      state.listSalesChannel = action.payload;
    },
    updateListBankTransferMethod: (state, action) => {
      state.listBankTransferMethod = action.payload;
    },
    updateListParentSalesRoutes: (state, action) => {
      state.listParentSalesRoutes = action.payload;
    },
    updateListChildrenSalesRoutes: (state, action) => {
      state.listChildrenSalesRoutes = action.payload;
    },
    updateListSalesTeam: (state, action) => {
      state.listSalesTeam = action.payload;
    },
    updateListSalesSubTeam: (state, action) => {
      state.listSalesSubTeam = action.payload;
    },
    updateListProvinceCity: (state, action) => {
      state.listProvinceCity = action.payload;
    },
    updateListWardCommune: (state, action) => {
      state.listWardCommune = action.payload;
    },
    updateListRecordingChannel: (state, action) => {
      state.listRecordingChannel = action.payload;
    },
    updateListPositions: (state, action) => {
      state.listPositions = action.payload;
    },
    updateListWarehouse: (state, action) => {
      state.listWarehouse = action.payload;
    },
    updateListWarehouseMD: (state, action) => {
      state.listWarehouseMD = action.payload;
    },
    updateListImportPort: (state, action) => {
      state.listImportPort = action.payload;
    },
    updateListExportPort: (state, action) => {
      state.listExportPort = action.payload;
    },
    updateListReceivingForm: (state, action) => {
      state.listReceivingForm = action.payload;
    },
    updateListProductTypes: (state, action) => {
      state.listProductTypes = action.payload;
    },
    updateListTransportMethod: (state, action) => {
      state.listTransportMethod = action.payload;
    },
    updateListCustomerOfficalSupport: (state, action) => {
      state.listCustomerOfficalSupport = action.payload;
    },
    updateListCustomerClassification: (state, action) => {
      state.listCustomerClassification = action.payload;
    },
    updateListBusinessType: (state, action) => {
      state.listBusinessType = action.payload;
    },
    updateListPartnerType: (state, action) => {
      state.listPartnerType = action.payload;
    },
    updateListPartnerGroup: (state, action) => {
      state.listPartnerGroup = action.payload;
    },
    updateListItemTypes: (state, action) => {
      state.listItemTypes = action.payload;
    },
    updateDetailUserID: (state, action) => {
      state.detailUserID = action.payload;
    },
    clearDetailUserID: state => {
      state.detailUserID = null;
    },
    updateListAddress: (state, action) => {
      state.listAddress = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    updateListVBH: (state, action) => {
      state.listVBH = action.payload;
    },
    updatelistVungSAP: (state, action) => {
      state.listVungSAP = action.payload;
    },
    updatelistBankKey: (state, action) => {
      state.listBankKey = action.payload;
    },
    updatelistTermsOfPayment: (state, action) => {
      state.listTermsOfPayment = action.payload;
    },
  },
});

export const {
  updateDetailCustomer,
  updateListCustomerType,
  updateListBanks,
  updateListCustomerGroup,
  updateListHonorifics,
  updateListResponsibilities,
  updateListBusinessRegistrationType,
  updateListBusinessDomain,
  updateListNation,
  updateListPostalCode,
  updateListSalesChannel,
  updateListParentSalesRoutes,
  updateListChildrenSalesRoutes,
  updateListSalesTeam,
  updateListSalesSubTeam,
  updateListProvinceCity,
  updateListWardCommune,
  updateListRecordingChannel,
  updateListPositions,
  updateListWarehouse,
  updateListImportPort,
  updateListExportPort,
  updateListReceivingForm,
  updateListProductTypes,
  updateListTransportMethod,
  updateListCustomerOfficalSupport,
  updateListCustomerClassification,
  updateListBusinessType,
  updateListPartnerType,
  updateListPartnerGroup,
  updateDetailUserID,
  clearDetailUserID,
  updateListAddress,
  setIsSubmitting,
  updateListItemTypes,
  updateListVBH,
  updateListWarehouseMD,
  updatelistVungSAP,
  updatelistBankKey,
  updatelistTermsOfPayment,
  updateListfactory
} = customerProfileSlice.actions;

export default customerProfileSlice.reducer;
