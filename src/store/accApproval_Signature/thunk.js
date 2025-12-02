import {
  updateListUser,
  setIsSubmitting,
  updateListCustomers,
  updateApprovalListProcess,
  updateDetailApprovalListProcess,
  updateListFilter,
  updateDetailCustomerChangeInfor,
  updateDetailMaterial,
  updateFilesAttach,
  updateDetailApprovalList,
} from '../accApproval_Signature/slide';
import {
  ApiGetListUser,
  ApiCustomerProfiles_Get,
  ApiPlanForUsers_GetById,
  ApiGeneralApprovals_GetListProcess,
  ApiGeneralApprovals_GetEntrys,
  ApiCustomerInformationExchanges_GetById,
  ApiDisplayMaterials_GetByID,
  ApiExportPDF_ExportPDF,
  Apiv2_OtherApprovals_GetByID,
  ApiApprovalProcess_GetById,
} from '@api';

const fetchApprovalListProcess = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiGeneralApprovals_GetListProcess(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateApprovalListProcess(result?.Processes));
          dispatch(updateListFilter(result?.Entrys));
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

const fetchDetailApprovalListProcess = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiPlanForUsers_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailApprovalListProcess(result));
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

const fetchListUser = body => async dispatch => {
  try {
    console.log('body', body);
    const {data} = await ApiGetListUser(body);
    // console.log('3', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        await new Promise(resolve => {
          dispatch(updateListUser(result));
          resolve();
        });
      } else {
        console.log('fetchListUser', data?.Message);
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListCustomers = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerProfiles_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      // console.log('resultaaaaaaaaaaaaa', result?.length);
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCustomers(result));
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

const fetchListFilter = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiGeneralApprovals_GetEntrys(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListFilter(result));
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

const fetchDetailCustomerChangeInfor = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerInformationExchanges_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailCustomerChangeInfor(result));
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

const fetchDetailMaterial = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiDisplayMaterials_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailMaterial(result));
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

const fetchApiv2_OtherApprovals_GetByID = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await Apiv2_OtherApprovals_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailApprovalList(result));
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
const fetchApiExportPDF_ExportPDF = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiExportPDF_ExportPDF(body);
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
const fetchApiApprovalProcess_GetById = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiApprovalProcess_GetById(body);
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
export {
  fetchListUser,
  fetchListCustomers,
  fetchApprovalListProcess,
  fetchDetailApprovalListProcess,
  fetchListFilter,
  fetchDetailCustomerChangeInfor,
  fetchDetailMaterial,
  fetchApiExportPDF_ExportPDF,
  fetchApiv2_OtherApprovals_GetByID,
  fetchApiApprovalProcess_GetById,
};
