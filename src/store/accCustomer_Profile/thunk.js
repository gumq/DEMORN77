import {
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
  setIsSubmitting,
  updateListCustomerOfficalSupport,
  updateListCustomerClassification,
  updateListBusinessType,
  updateListPartnerType,
  updateListPartnerGroup,
  updateDetailUserID,
  updateListAddress,
  updateListItemTypes,
  updateListVBH,
  updateListWarehouseMD,
  updatelistVungSAP,
  updatelistBankKey,
  updatelistTermsOfPayment,
  updateListfactory,
} from '../accCustomer_Profile/slide';
import {
  ApiCategoryGenerals_GetByType,
  ApiCategoryGeneralTrees_Get,
  ApiCategoryGeneralTrees_GetByListParentID,
  ApiCustomerProfiles_GetById,
  ApiNPLRegions_GetByParentID,
  ApiCategoryGeneralTrees_GetByParentID,
  ApiGetUserByUserID,
  ApiCategoryGenerals_Get,
  ApiCustomerProfiles_CheckInfoTaxCode,
  ApiCustomerProfiles_GetCategoryCustomer,
} from '@api';

const fetchDetailCustomer = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerProfiles_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailCustomer(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListCategoryType = () => async dispatch => {
  const body = {
    CategoryType:
      'CustomerType,Nation,Banks,CustomerGroup,Honorifics,' +
      'BusinessSector,BusinessRegistrationType,PostalCode,' +
      'SalesOrganization,SalesChannel,Ports,ExportPort,CustomerClassification,' +
      'TransportMethod,BankTransferMethod,GoodsTypes,Customers,BusinessType,ShippingAddresses,' +
      'RecordingChannel,ChargeJobs,ReceivingForm,Warehouse,ImportPort,PartnerType,PartnerGroup,RegionSAP,BankKey,TermsOfPayment',
  };
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListCustomerType(result?.CustomerType));
          dispatch(updateListBanks(result?.Banks));
          dispatch(updateListCustomerGroup(result?.CustomerGroup));
          dispatch(updateListHonorifics(result?.Honorifics));
          dispatch(updateListRecordingChannel(result?.RecordingChannel));
          dispatch(updateListPositions(result?.ChargeJobs));
          dispatch(updateListImportPort(result?.Ports));
          dispatch(updateListExportPort(result?.Ports));
          dispatch(updateListWarehouseMD(result?.Warehouse));
          dispatch(updateListReceivingForm(result?.ReceivingForm));
          dispatch(updateListProductTypes(result?.GoodsTypes));
          dispatch(
            updateListBusinessRegistrationType(
              result?.BusinessRegistrationType,
            ),
          );
          dispatch(updatelistVungSAP(result?.RegionSAP));
          dispatch(updateListBusinessDomain(result?.BusinessSector));
          dispatch(updateListPostalCode(result?.PostalCode));
          dispatch(updateListSalesChannel(result?.SalesChannel));
          dispatch(updateListTransportMethod(result?.TransportMethod));
          dispatch(updateListResponsibilities(result?.Responsibilities));
          dispatch(updateListCustomerOfficalSupport(result?.Customers));
          dispatch(
            updateListCustomerClassification(result?.CustomerClassification),
          );
          dispatch(updateListBusinessType(result?.BusinessType));
          dispatch(updateListPartnerType(result?.PartnerType));
          dispatch(updateListPartnerGroup(result?.PartnerGroup));
          dispatch(updateListAddress(result?.ShippingAddresses));
          dispatch(updatelistBankKey(result?.BankKey));
          dispatch(updatelistTermsOfPayment(result?.TermsOfPayment));
          resolve();
        });
      } else {
        console.log('fetchListCategoryType', data?.Message);
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('fetchListCategoryType', error);
  }
};

const fetchListParentSaleRoutes = body => async dispatch => {
  try {
    const {data} = await ApiCategoryGeneralTrees_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListParentSalesRoutes(result));
          resolve();
        });
      } else {
        console.log('fetchListParentSaleRoutes', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListParentSaleRoutes', error);
  }
};
const fetchListItemType = () => async dispatch => {
  const body = {
    CategoryType: 'CurrentDocs',
  };
  console.log(body);
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCategoryGenerals_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data?.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListItemTypes(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('error', error);
  }
};
const fetchListChildrenSaleRoutes = body => async dispatch => {
  try {
    const {data} = await ApiCategoryGeneralTrees_GetByListParentID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListChildrenSalesRoutes(result));
          resolve();
        });
      } else {
        console.log('fetchListChildrenSaleRoutes', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListChildrenSaleRoutes', error);
  }
};

const fetchListNation = () => async dispatch => {
  const body = {
    ParentId: 0,
  };
  console.log('listNation', body);
  try {
    const {data} = await ApiNPLRegions_GetByParentID(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListNation(result));
          resolve();
        });
      } else {
        console.log('fetchListProvinceCity', data?.Message);
      }
    }
  } catch (err) {
    console.log('fetchListProvinceCity', err);
  }
};

const fetchListProvinceCity = body => async dispatch => {
  try {
    const {data} = await ApiNPLRegions_GetByParentID(body);
    if (data?.StatusCode === 200 && data?.ErrorCode === '0') {
      dispatch(updateListProvinceCity(data.Result));
      return Promise.resolve(data.Result);
    }
    return Promise.resolve([]);
  } catch (err) {
    console.log('fetchListProvinceCity', err);
    return Promise.reject(err);
  }
};

const fetchListWardCommune = body => async dispatch => {
  try {
    const {data} = await ApiNPLRegions_GetByParentID(body);
    if (data?.StatusCode === 200 && data?.ErrorCode === '0') {
      dispatch(updateListWardCommune(data.Result));
      return Promise.resolve(data.Result);
    } else {
      return Promise.resolve([]);
    }
  } catch (err) {
    console.log('fetchListWardCommune', err);
    return Promise.reject(err);
  }
};

const fetchListWareHouse = body => async dispatch => {
  try {
    const {data} = await ApiCategoryGeneralTrees_Get(body);
    console.log('5', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await dispatch(updateListWarehouse(result));
        return result;
      } else {
        console.log('fetchListWareHouse', data?.Message);
        throw new Error(data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListWareHouse', error);
    throw err;
  }
};

const fetchListSalesTeam = () => async dispatch => {
  const body = {
    // CategoryType: 'SalesTeam',
    //  sửa cho đồng bộ ưeb
    CategoryType: 'Area',
    ParentID: 0,
  };
  try {
    const {data} = await ApiCategoryGeneralTrees_GetByParentID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListSalesTeam(result));
          resolve();
        });
      } else {
        console.log('fetchListSalesTeam', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListSalesTeam', error);
  }
};

const fetchListSalesSubTeam = body => async dispatch => {
  try {
    const {data} = await ApiCategoryGeneralTrees_GetByParentID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          // console.log('result', result);
          dispatch(updateListSalesSubTeam(result));
          resolve();
        });
      } else {
        console.log('fetchListSalesSubTeam', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListSalesSubTeam', error);
  }
};

const fetchListSalesVBH = body => async dispatch => {
  try {
    const {data} = await ApiCategoryGeneralTrees_GetByParentID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          // console.log('result', result);
          dispatch(updateListVBH(result));
          resolve();
        });
      } else {
        console.log('fetchListSalesSubTeam', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListSalesSubTeam', error);
  }
};

const fetchDetailUserID = body => async dispatch => {
  try {
    const {data} = await ApiGetUserByUserID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateDetailUserID(result));
          resolve();
        });
      } else {
        console.log('fetchDetailUserID', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchDetailUserID', error);
  }
};
const fetchApiCustomerProfiles_CheckInfoTaxCode = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerProfiles_CheckInfoTaxCode(body);
    console.log('data', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        return result;
      } else {
        dispatch(setIsSubmitting(false));
        return false;
      }
    } else {
      dispatch(setIsSubmitting(false));
      return false;
    }
  } catch (error) {
    dispatch(setIsSubmitting(false));
    return false;
  }
};
const fetchApiCustomerProfiles_GetCategoryCustomer = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerProfiles_GetCategoryCustomer(body);
    console.log('data', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(updateListfactory(result));
        dispatch(setIsSubmitting(false));
        return result;
      } else {
        dispatch(setIsSubmitting(false));
        return false;
      }
    } else {
      dispatch(setIsSubmitting(false));
      return false;
    }
  } catch (error) {
    dispatch(setIsSubmitting(false));
    return false;
  }
};
export {
  fetchDetailCustomer,
  fetchListCategoryType,
  fetchListParentSaleRoutes,
  fetchListChildrenSaleRoutes,
  fetchListNation,
  fetchListProvinceCity,
  fetchListWardCommune,
  fetchListWareHouse,
  fetchListSalesTeam,
  fetchListSalesSubTeam,
  fetchDetailUserID,
  fetchListItemType,
  fetchListSalesVBH,
  fetchApiCustomerProfiles_CheckInfoTaxCode,
  fetchApiCustomerProfiles_GetCategoryCustomer
};
