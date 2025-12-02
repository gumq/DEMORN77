import {
  setIsSubmitting,
  updateListComplaintWarranties,
  updateDetailComplaintWarries,
  updateListSOByCustomer,
  updateListItemBySO,
  updateListEntryComplaint,
  updateListComplaintType,
  updateListODBySO,
  updateListNotOD,
  updateListProductError
} from '../acc_Complaint_Warranties/slide';
import {
  ApiComplaints_GetMobile,
  ApiComplaints_GetMobileByID,
  ApiComplaints_GetSOByCusID,
  ApiComplaints_GetItemBySO,
  ApiEntrys_GetByFactorEntry,
  ApiCategoryGenerals_GetByType,
  ApiComplaints_GetODBySO,
  ApiComplaints_GetNotOD,
  ApiCategoryGeneralTrees_GetByType
} from '@api';

const fetchListComplaintWarranties = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiComplaints_GetMobile();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListComplaintWarranties(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchDetailComplaintWarranties = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiComplaints_GetMobileByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailComplaintWarries(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListEntryComplaint = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiEntrys_GetByFactorEntry(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListEntryComplaint(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListSOByCustomer = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiComplaints_GetSOByCusID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListSOByCustomer(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListODBySO = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiComplaints_GetODBySO(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListODBySO(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListNotOD = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiComplaints_GetNotOD();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListNotOD(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListItemBySO = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiComplaints_GetItemBySO(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListItemBySO(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListCategoryTypeComplaint = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  const body = {
    CategoryType: "ComplaintType"
  }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListComplaintType(result?.ComplaintType));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListProductError = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  const body = {
    CategoryType: "DefectLoc"
  }
  try {
    const { data } = await ApiCategoryGeneralTrees_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListProductError(result?.DefectLoc));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};


export {
  fetchListComplaintWarranties,
  fetchDetailComplaintWarranties,
  fetchListEntryComplaint,
  fetchListSOByCustomer,
  fetchListItemBySO,
  fetchListCategoryTypeComplaint,
  fetchListODBySO,
  fetchListNotOD,
  fetchListProductError
}
