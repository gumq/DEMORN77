import axios from 'axios';
import {
  getLocale,
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearRefreshToken,
} from '../storage';
import Config from 'react-native-config';

axios.interceptors.request.use(
  async config => {
    // console.log(Config.API_URL);
    config.baseURL = Config.API_URL;
    let language = JSON.parse(await getLocale());
    config.headers.Language = language ? language.Code : 'vn';

    const skipAuthUrls = [
      '/authentication/LoginUserCmpnID',
      'config/ChoseLanguage',
      'config/MobileLanguage',
    ];
    const shouldSkipAuth = skipAuthUrls.some(url => config.url.includes(url));

    if (!shouldSkipAuth) {
      const token = JSON.parse(await getToken());
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error),
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const tokenRefresh = JSON.parse(await getRefreshToken());
      if (tokenRefresh) {
        let val = await ApiRefreshToken({refreshToken: tokenRefresh});
        let result = val.status ? val.data : null;
        if (result) {
          setToken(result.Token);
          setRefreshToken(result.RefreshToken);
          originalRequest.headers.Authorization = 'Bearer ' + result.Token;
          return axios(originalRequest);
        } else {
          clearToken();
          clearRefreshToken();
          clearUserInfo();
        }
      }
    }

    if (__DEV__ && error.response) {
      const {config, status, data} = error.response;
      console.log(`URL: ${config?.url}\n`, `STATUS: ${status}\n `, data);
    }
    return Promise.reject(error);
  },
);

export const ApiChooseLanguage = () => {
  return axios({
    method: 'post',
    url: 'config/ChoseLanguage',
    data: {},
  });
};

export const ApiGetLanguageDetails = () => {
  return axios({
    method: 'post',
    url: 'customize-ver2/MobileLanguage',
    data: {TableName: 'eSales'},
  });
};

export const ApiLogin = body => {
  return axios({
    method: 'post',
    url: 'authentication/LoginUserCmpnID',
    data: body,
  });
};

export const ApiChangePasswordCustomer = body => {
  return axios({
    method: 'post',
    url: 'authentication/ChangePasswordUser',
    data: body,
  });
};
export const ApiChangeInfoCustomer = body => {
  return axios({
    method: 'post',
    url: 'user/EditUser',
    data: body,
  });
};

export const ApiCheckTokenAppValid = body => {
  return axios({
    method: 'post',
    url: 'authentication/CheckToken',
    data: body,
  });
};

export const ApiRefreshToken = body => {
  return axios({
    method: 'post',
    url: 'authentication/RefreshToken',
    data: body,
  });
};

// api logout
export const ApiauthenticationLogOut = body => {
  return axios({
    method: 'post',
    url: 'authentication/LogOut',
    data: body,
  });
};

// Thay đổi tài khoản
export const ApiGetInfoContact = () => {
  return axios({
    method: 'post',
    url: 'CompanyConfig/GetContactByUserID',
    data: {},
  });
};
export const Apiuser_GetCurrentUser = () => {
  return axios({
    method: 'post',
    url: 'user/GetCurrentUser',
    data: {},
  });
};
export const ApiCompanyConfig_GetByUserID = () => {
  return axios({
    method: 'post',
    url: 'CompanyConfig/GetByUserID',
    data: {},
  });
};
//get menu
export const ApiGetMenuRightByGroupID = body => {
  return axios({
    method: 'post',
    url: 'menu/GetMenuRightByGroupID',
    data: body,
  });
};

// add phần thông báo
export const ApiAddTokenFirebase = body => {
  return axios({
    method: 'post',
    url: 'TokenAppVer2/Add',
    data: body,
  });
};

export const ApiGetNotify = data => {
  return axios({
    method: 'post',
    url: 'NotifyVer2/Get',
    data,
  });
};

export const ApiGetTotalNotify = () => {
  return axios({
    method: 'post',
    url: 'NotifyVer2/GetTotal',
    data: {},
  });
};

export const ApiUpdateViewNoti = body => {
  return axios({
    method: 'post',
    url: 'NotifyVer2/UpdateView',
    data: body,
  });
};

export const ApiDeleteNoti = body => {
  return axios({
    method: 'post',
    url: 'NotifyVer2/DeleteNotifyByListDetails',
    data: body,
  });
};

// add gps
export const ApiGPSTrackingAdd = body => {
  return axios({
    method: 'post',
    url: 'GPSTracking/Add',
    data: body,
  });
};

// upload files
export const ApiUploadFile = body => {
  return axios({
    method: 'post',
    url: 'AttachFiles/Add',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const ApiCategoryGenerals_Get = body => {
  // lấy danh sách category theo CategoryType
  return axios({
    method: 'post',
    url: 'CategoryGenerals/Get',
    data: body,
  });
};

export const ApiConditionKeys_GetConfigs = body => {
  // Lấy data selectbox theo ngành hàng
  return axios({
    method: 'post',
    url: 'ConditionKeys/GetConfigs',
    data: body,
  });
};

// MODULE TRÌNH KÝ XÉT DUYỆT----------------------------------------------------------------

export const ApiGeneralApprovals_GetListProcess = body => {
  // lấy danh sách trình ký xét duyệt
  return axios({
    method: 'post',
    url: 'GeneralApprovals/GetListProcess',
    data: body,
  });
};

export const ApiGeneralApprovals_ApprovalList = body => {
  // duyệt danh sách trình ký
  return axios({
    method: 'post',
    url: 'GeneralApprovals/ApprovalList',
    data: body,
  });
};

export const ApiGeneralApprovals_GetEntrys = body => {
  // duyệt danh sách trình ký
  return axios({
    method: 'post',
    url: 'GeneralApprovals/GetEntrys',
    data: body,
  });
};

export const ApiGetListUser = body => {
  //Lấy danh sách user
  return axios({
    method: 'post',
    url: 'user/GetListUser',
    data: body,
  });
};

export const ApiCustomerProfiles_Get = () => {
  //Lấy danh sách customer
  return axios({
    method: 'post',
    url: 'CustomerProfiles/Get',
    data: {},
  });
};

export const ApiGetUserByUserID = body => {
  //Lấy chi tiết user
  return axios({
    method: 'post',
    url: 'user/GetUserByUserID',
    data: body,
  });
};

// MODULE BÁN HÀNG ----------------------------------------------------------------------

export const ApiPlanForUsers_Get = body => {
  // lấy danh sách kế hoạch thăm khách hàng
  return axios({
    method: 'post',
    url: 'PlanForUsers/Get',
    data: body,
  });
};

export const ApiPlanForUsers_GetById = body => {
  // lấy chi tiết kế hoạch thăm khách hàng
  return axios({
    method: 'post',
    url: 'PlanForUsers/GetById',
    data: body,
  });
};

export const ApiPlanForUsers_CalendarCheck = body => {
  // check lịch trước khi thêm
  return axios({
    method: 'post',
    url: 'PlanForUsers/CalendarCheck',
    data: body,
  });
};

export const ApiPlanForUsers_AddPlan = body => {
  // thêm kế hoạch
  return axios({
    method: 'post',
    url: 'PlanForUsers/AddPlan',
    data: body,
  });
};

export const ApiPlanForUsers_AddDetail = body => {
  // thêm chi tiết kế hoạch
  return axios({
    method: 'post',
    url: 'PlanForUsers/AddDetail',
    data: body,
  });
};

export const ApiPlanForUsers_EditPlan = body => {
  // chỉnh sửa kế hoạch
  return axios({
    method: 'post',
    url: 'PlanForUsers/EditPlan',
    data: body,
  });
};

export const ApiPlanForUsers_SubmitPlan = body => {
  // khóa kế hoạch
  return axios({
    method: 'post',
    url: 'PlanForUsers/SubmitPlan',
    data: body,
  });
};

export const ApiCategoryGeneralTrees_GetByListID = body => {
  // tuyến chăm sóc khách hàng
  return axios({
    method: 'post',
    url: 'CategoryGeneralTrees/GetByListID',
    data: body,
  });
};

export const ApiVisitForUsers_Get = body => {
  // danh sách ghé thăm khách hàng
  return axios({
    method: 'post',
    url: 'VisitForUsers/Get',
    data: body,
  });
};

export const ApiVisitForUsers_AddInventory = body => {
  // thêm hàng tồn kho
  return axios({
    method: 'post',
    url: 'VisitForUsers/AddInventory',
    data: body,
  });
};

export const ApiVisitForUsers_Business = body => {
  // Thông tin kinh doanh
  return axios({
    method: 'post',
    url: 'VisitForUsers/Business',
    data: body,
  });
};

export const ApiVisitForUsers_Rival = body => {
  // Thông tin đối thủ
  return axios({
    method: 'post',
    url: 'VisitForUsers/Rival',
    data: body,
  });
};

export const ApiVisitForUsers_FeedBack = body => {
  // Thông tin ý kiến khách hàng
  return axios({
    method: 'post',
    url: 'VisitForUsers/FeedBack',
    data: body,
  });
};

export const ApiVisitForUsers_CheckOut = body => {
  // checkout ghé thăm khách hàng
  return axios({
    method: 'post',
    url: 'VisitForUsers/CheckOut',
    data: body,
  });
};

export const ApiVisitForUsers_CheckIn = body => {
  // checkin ghé thăm khách hàng
  return axios({
    method: 'post',
    url: 'VisitForUsers/CheckIn',
    data: body,
  });
};

export const ApiVisitForUsers_GetById = body => {
  // chi tiết ghé thăm khách hàng
  return axios({
    method: 'post',
    url: 'VisitForUsers/GetById',
    data: body,
  });
};

export const ApiPlanForUsers_GetListCustomers = body => {
  // Lấy danh sách khách hàng theo UserID cho Plan
  return axios({
    method: 'post',
    url: 'PlanForUsers/GetListCustomers',
    data: body,
  });
};

export const ApiVisitForUsers_Cancel = body => {
  // Hủy ghé thăm khách hàng
  return axios({
    method: 'post',
    url: 'VisitForUsers/Cancel',
    data: body,
  });
};

export const ApiVisitForUsers_OFFRoute = body => {
  // Thêm khách hàng trái tuyến
  return axios({
    method: 'post',
    url: 'VisitForUsers/OFFRoute',
    data: body,
  });
};

export const ApiVisitForUsers_GETOFFSchedule = body => {
  // Danh sách khách hàng trái tuyến
  return axios({
    method: 'post',
    url: 'VisitForUsers/GETOFFSchedule',
    data: body,
  });
};

//Yêu cầu đặt hàng

export const ApiOrderRequests_Get = () => {
  // danh sách yêu cầu đặt hàng
  return axios({
    method: 'post',
    url: 'OrderRequests/Get',
    data: {},
  });
};

export const ApiOrderRequests_GetByID = body => {
  // chi tiết yêu cầu đặt hàng
  return axios({
    method: 'post',
    url: 'OrderRequests/GetByID',
    data: body,
  });
};

export const ApiOrderRequests_Add = body => {
  // Thêm mới yêu cầu đặt hàng
  return axios({
    method: 'post',
    url: 'OrderRequests/Add',
    data: body,
  });
};

export const ApiOrderRequests_Edit = body => {
  // Sửa yêu cầu đặt hàng
  return axios({
    method: 'post',
    url: 'OrderRequests/Edit',
    data: body,
  });
};

export const ApiOrderRequests_Delete = body => {
  // Xóa yêu cầu đặt hàng
  return axios({
    method: 'post',
    url: 'OrderRequests/Delete',
    data: body,
  });
};

export const ApiOrderRequests_Submit = body => {
  // Xác nhận khóa yêu cầu đặt hàng
  return axios({
    method: 'post',
    url: 'OrderRequests/Submit',
    data: body,
  });
};

export const ApiCustomerRequests_GetItem = body => {
  // Tra thông tin mã sản phẩm
  return axios({
    method: 'post',
    url: 'CustomerRequests/GetItem',
    data: body,
  });
};

export const ApiCustomerRequests_Response = body => {
  // Phản hồi thông tin
  return axios({
    method: 'post',
    url: 'CustomerRequests/Response',
    data: body,
  });
};

export const ApiCustomerRequests_Receive = body => {
  // Tiếp nhận
  return axios({
    method: 'post',
    url: 'CustomerRequests/Receive',
    data: body,
  });
};

// Hủy đơn hàng/Hợp đồng - Gia hạn

export const ApiOtherProposals_Get = () => {
  // danh sách đề xuất
  return axios({
    method: 'post',
    url: 'OtherProposals/Get',
    data: {},
  });
};

export const ApiOtherProposals_GetByID = body => {
  // chi tiết đề xuất
  return axios({
    method: 'post',
    url: 'OtherProposals/GetByID',
    data: body,
  });
};

export const ApiOtherProposals_Add = body => {
  // Thêm mới đề xuất
  return axios({
    method: 'post',
    url: 'OtherProposals/Add',
    data: body,
  });
};

export const ApiOtherProposals_Edit = body => {
  // Sửa đề xuất
  return axios({
    method: 'post',
    url: 'OtherProposals/Edit',
    data: body,
  });
};

export const ApiOtherProposals_Submit = body => {
  // Xác nhận khóa
  return axios({
    method: 'post',
    url: 'OtherProposals/Submit',
    data: body,
  });
};

// Hạn mức tín dụng
export const ApiCreditLimitProposal_Get = body => {
  // Lấy danh sách hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/Get',
    data: body,
  });
};

export const ApiCreditLimitProposal_GetById = body => {
  // Lấy chi tiết hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/GetById',
    data: body,
  });
};

export const ApiCreditLimitProposal_Add = body => {
  // Thêm mới hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/Add',
    data: body,
  });
};

export const ApiCreditLimitProposal_Edit = body => {
  // Sửa hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/Edit',
    data: body,
  });
};

export const ApiCreditLimitProposal_Delete = body => {
  // Xóa hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/Delete',
    data: body,
  });
};

export const ApiCreditLimitProposal_Submit = body => {
  // Xác nhận khóa hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/Submit',
    data: body,
  });
};

export const ApiCategoryGenerals_GetByType = body => {
  // Lấy danh sách danh mục để thêm hạn mức tín dụng
  return axios({
    method: 'post',
    url: 'CategoryGenerals/GetByType',
    data: body,
  });
};

export const ApiCreditLimitProposal_GetSAPInfo = body => {
  // Lấy thông tin SAP
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/GetSAPInfo',
    data: body,
  });
};
export const ApiCreditLimitProposal_GetInfoSale = body => {
  // Lấy thông tin SAP
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/GetInfoSale',
    data: body,
  });
};
export const ApiEntrys_GetByFactorEntry = body => {
  // Lấy danh sách entry
  return axios({
    method: 'post',
    url: 'Entrys/GetByFactorEntry',
    data: body,
  });
};

export const ApiCreditLimitProposal_GetListCategories = body => {
  // Lọc danh sách nhóm, khách hàng, nhân viên
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/GetListCategories',
    data: body,
  });
};

export const ApiCreditLimitProposal_Confirm = body => {
  // Confirm đơn từ KH
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/Confirm',
    data: body,
  });
};

export const ApiEntrys_GetByFactorID = body => {
  // List entry
  return axios({
    method: 'post',
    url: 'Entrys/GetByFactorID',
    data: body,
  });
};

export const ApiFactors_GetByList = body => {
  // List factor
  return axios({
    method: 'post',
    url: 'Factors/GetByList',
    data: body,
  });
};

// Hồ sơ khách hàng

export const ApiCustomerProfiles_GetById = body => {
  // Lấy chi tiết khách hàng
  return axios({
    method: 'post',
    url: 'CustomerProfiles/GetById',
    data: body,
  });
};

export const ApiCustomerProfiles_CheckInfoTaxCode = body => {
  // Lấy chi tiết khách hàng
  return axios({
    method: 'post',
    url: 'CustomerProfiles/CheckInfoTaxCode',
    data: body,
  });
};

export const ApiCustomerProfiles_Add = body => {
  // Thêm mới thông tin khách hàng mới
  return axios({
    method: 'post',
    url: 'CustomerProfiles/Add',
    data: body,
  });
};

export const ApiCustomerProfiles_Edit = body => {
  // Sửa thông tin khách hàng
  return axios({
    method: 'post',
    url: 'CustomerProfiles/Edit',
    data: body,
  });
};

export const ApiCustomerProfiles_Delete = body => {
  // Xóa thông tin khách hàng
  return axios({
    method: 'post',
    url: 'CustomerProfiles/Delete',
    data: body,
  });
};

export const ApiCustomerProfiles_Submit = body => {
  // Xác nhận khóa thông tin khách hàng
  return axios({
    method: 'post',
    url: 'CustomerProfiles/Submit',
    data: body,
  });
};

export const ApiCategoryGeneralTrees_Get = body => {
  // Lấy danh sách vùng
  return axios({
    method: 'post',
    url: 'CategoryGeneralTrees/Get',
    data: body,
  });
};

export const ApiCategoryGeneralTrees_GetByListParentID = body => {
  // Lấy danh sách chi tiết khu vực tuyến
  return axios({
    method: 'post',
    url: 'CategoryGeneralTrees/GetByListParentID',
    data: body,
  });
};

export const ApiNPLRegions_GetByParentID = body => {
  // Lấy danh sách tỉnh quận huyện
  return axios({
    method: 'post',
    url: 'Regions/GetByParentID',
    data: body,
  });
};

export const ApiCategoryGeneralTrees_GetByParentID = body => {
  // Lấy danh sách SalesTeam and SubTeams
  return axios({
    method: 'post',
    url: 'CategoryGeneralTrees/GetByParentID',
    data: body,
  });
};

//Yêu cầu của khách hàng

export const ApiCustomerRequests_Get = () => {
  // Lấy danh sách yêu cầu khách hàng
  return axios({
    method: 'post',
    url: 'CustomerRequests/Get',
    data: {},
  });
};

export const ApiCustomerRequests_GetByID = body => {
  // Lấy chi tiết yêu cầu
  return axios({
    method: 'post',
    url: 'CustomerRequests/GetByID',
    data: body,
  });
};

export const ApiCustomerRequests_Add = body => {
  // Thêm mới yêu cầu khách hàng
  return axios({
    method: 'post',
    url: 'CustomerRequests/Add',
    data: body,
  });
};

export const ApiCustomerRequests_Edit = body => {
  // Chỉnh sửa yêu cầu khách hàng
  return axios({
    method: 'post',
    url: 'CustomerRequests/Edit',
    data: body,
  });
};

export const ApiCustomerRequests_Delete = body => {
  // Xóa yêu cầu khách hàng
  return axios({
    method: 'post',
    url: 'CustomerRequests/Delete',
    data: body,
  });
};

export const ApiCustomerRequests_Submit = body => {
  // Xác nhận khóa yêu cầu khách hàng
  return axios({
    method: 'post',
    url: 'CustomerRequests/Submit',
    data: body,
  });
};

export const ApiCategoryGeneralTrees_GetByLevel = body => {
  // Xác nhận khóa yêu cầu khách hàng
  return axios({
    method: 'post',
    url: 'CategoryGeneralTrees/GetByLevel',
    data: body,
  });
};

//Đơn hàng

export const ApiSaleOrders_Get = () => {
  // Lấy danh sách đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/Get',
    data: {},
  });
};

export const ApiSaleOrders_GetByID = body => {
  // Lấy chi tiết đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/GetByID',
    data: body,
  });
};

export const ApiSaleOrders_GetDocuments = body => {
  // Lấy danh sách chứng từ
  return axios({
    method: 'post',
    url: 'Orders/GetDocuments',
    data: body,
  });
};

export const ApiConditionTypes_GetPrices = body => {
  // Tính giá sản phẩm trong đơn hàng
  return axios({
    method: 'post',
    url: 'ConditionTypes/GetPrices',
    data: body,
  });
};

export const ApiSaleOrders_Add = body => {
  // Thêm đơn hàng mới
  return axios({
    method: 'post',
    url: 'Orders/Add',
    data: body,
  });
};

export const ApiSaleOrders_Edit = body => {
  // Sửa đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/Edit',
    data: body,
  });
};

export const ApiSaleOrders_Delete = body => {
  // Xóa đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/Delete',
    data: body,
  });
};

export const ApiSaleOrder_Submit = body => {
  // Xác nhận đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/Submit',
    data: body,
  });
};

export const ApiItems_Get = body => {
  // Lấy danh sách sản phẩm
  return axios({
    method: 'post',
    url: 'Orders/GetItems',
    data: body,
  });
};

export const ApiCategoryConfigs_Get = body => {
  // Lấy danh sách loại chứng từ
  return axios({
    method: 'post',
    url: 'DocumentTypes/GetActive',
    data: body,
  });
};

export const ApiOrders_GetDocuments = body => {
  // Số chứng từ đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/GetDocuments',
    data: body,
  });
};

export const ApiOrders_GetAddress = body => {
  // Địa chỉ đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/GetAddress',
    data: body,
  });
};

export const ApiOrders_CheckInventory = body => {
  // Kiểm tra hàng tồn kho
  return axios({
    method: 'post',
    url: 'Orders/CheckInventory',
    data: body,
  });
};

export const ApiOrders_EditPrices = body => {
  //Tính giá sản phẩm
  return axios({
    method: 'post',
    url: 'Orders/EditPrices',
    data: body,
  });
};

export const ApiSaleOrder_Cancel = body => {
  // Hủy đơn hàng
  return axios({
    method: 'post',
    url: 'Orders/Cancel',
    data: body,
  });
};

//Đề xuất chi phí

export const ApiBrandPromotionBudgets_Get = () => {
  // Lấy danh sách đề xuất chi phí
  return axios({
    method: 'post',
    url: 'BudgetProposals/Get',
    data: {},
  });
};

export const ApiBrandPromotionBudgets_GetByID = body => {
  // Lấy chi tiết đề xuất chi phí
  return axios({
    method: 'post',
    url: 'BudgetProposals/GetByID',
    data: body,
  });
};

export const ApiBrandPromotionBudgets_Add = body => {
  // Thêm đề xuất chi phí mới
  return axios({
    method: 'post',
    url: 'BudgetProposals/Add',
    data: body,
  });
};

export const ApiBrandPromotionBudgets_Edit = body => {
  // Sửa đề xuất chi phí
  return axios({
    method: 'post',
    url: 'BudgetProposals/Edit',
    data: body,
  });
};

export const ApiBrandPromotionBudgets_Delete = body => {
  // Xóa đề xuất chi phí
  return axios({
    method: 'post',
    url: 'BudgetProposals/Delete',
    data: body,
  });
};

export const ApiBrandPromotionBudgets_Submit = body => {
  // Xác nhận đề xuất chi phí
  return axios({
    method: 'post',
    url: 'BudgetProposals/Submit',
    data: body,
  });
};

export const ApiSaleInventorys_Get = body => {
  // Danh sách hàng tồn kho
  return axios({
    method: 'post',
    url: 'SaleInventorys/GetMobile',
    data: body,
  });
};

export const ApiSaleInventorys_GetItem = body => {
  // Chi hàng tồn kho
  return axios({
    method: 'post',
    url: 'SaleInventorys/GetItem',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_Get = () => {
  // Danh sách đề xuất giữ bán
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/Get',
    data: {},
  });
};

export const ApiCategoryGeneralTrees_GetByType = body => {
  // Danh mục kho hàng, nhà máy
  return axios({
    method: 'post',
    url: 'CategoryGeneralTrees/GetByType',
    data: body,
  });
};

export const ApiItems_GetByGoodTypeID = body => {
  // Danh mục sản phẩm
  return axios({
    method: 'post',
    url: 'Items/GetByGoodTypeID',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_Add = body => {
  // Thêm đề xuất giữ hàng
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/Add',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_Edit = body => {
  // Sửa đề xuất giữ hàng
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/Edit',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_Submit = body => {
  // Submit đề xuất giữ hàng
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/Submit',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_GetByID = body => {
  // Chi tiết đề xuất giữ hàng
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/GetByID',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_Renew = body => {
  // Gia hạn yêu cầu giữ bán
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/Renew',
    data: body,
  });
};

export const ApiSaleInventoryKeeps_Cancel = body => {
  // Hủy giữ hàng
  return axios({
    method: 'post',
    url: 'SaleInventoryKeeps/Cancel',
    data: body,
  });
};

//Đóng/Chuyển mã khách hàng

export const ApiCustomerArchived_Get = () => {
  // Danh sách đóng/chuyển mã khách hàng
  return axios({
    method: 'post',
    url: 'CustomerArchived/Get',
    data: {},
  });
};

export const ApiCustomerArchived_GetById = body => {
  // Chi tiết đóng/chuyển mã khách hàng
  return axios({
    method: 'post',
    url: 'CustomerArchived/GetById',
    data: body,
  });
};

export const ApiCustomerArchived_Add = body => {
  // Thêm đóng/chuyển mã khách hàng
  return axios({
    method: 'post',
    url: 'CustomerArchived/Add',
    data: body,
  });
};

export const ApiCustomerArchived_Edit = body => {
  // Sửa đóng/chuyển mã khách hàng
  return axios({
    method: 'post',
    url: 'CustomerArchived/Edit',
    data: body,
  });
};

export const ApiCustomerArchived_Delete = body => {
  // Sửa đóng/chuyển mã khách hàng
  return axios({
    method: 'post',
    url: 'CustomerArchived/Delete',
    data: body,
  });
};
export const ApiCustomerArchived_Submit = body => {
  // Submit đóng/chuyển mã khách hàng
  return axios({
    method: 'post',
    url: 'CustomerArchived/Submit',
    data: body,
  });
};

export const ApiCustomerSalesAccesses_GetByTaxCode = body => {
  // Nhập mã số thuế lấy KH
  return axios({
    method: 'post',
    url: 'CustomerSalesAccesses/GetByTaxCode',
    data: body,
  });
};

// Báo giá
export const ApiQuotation_Get = () => {
  // Lấy danh sách hạn báo giá
  return axios({
    method: 'post',
    url: 'Quotation/Get',
    data: {},
  });
};
export const ApiQuotation_EditPrice = body => {
  // Lấy danh sách hạn báo giá
  return axios({
    method: 'post',
    url: 'Quotation/EditPrice',
    data: body,
  });
};
export const ApiQuotation_GetById = body => {
  // Lấy chi tiết báo giá
  return axios({
    method: 'post',
    url: 'Quotation/GetById',
    data: body,
  });
};

export const ApiQuotation_Add = body => {
  // Thêm mới báo giá
  return axios({
    method: 'post',
    url: 'Quotation/Add',
    data: body,
  });
};

export const ApiQuotation_Edit = body => {
  // Sửa báo giá
  return axios({
    method: 'post',
    url: 'Quotation/Edit',
    data: body,
  });
};

export const ApiQuotation_Delete = body => {
  // Xóa báo giá
  return axios({
    method: 'post',
    url: 'Quotation/Delete',
    data: body,
  });
};

export const ApiQuotation_Submit = body => {
  // Xác nhận khóa báo giá
  return axios({
    method: 'post',
    url: 'Quotation/Submit',
    data: body,
  });
};

export const ApiQuotation_GetItems = body => {
  // Lấy danh sách sản phẩm theo ngành và kh
  return axios({
    method: 'post',
    url: 'Quotation/GetItems',
    data: body,
  });
};

// Yêu cầu cọc thanh toán
export const ApiPaymentRequests_Get = () => {
  // Lấy danh sách yêu cầu cọc thanh toán
  return axios({
    method: 'post',
    url: 'PaymentRequests/Get',
    data: {},
  });
};

export const ApiPaymentRequests_GetByID = body => {
  // Lấy chi tiết yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentRequests/GetByID',
    data: body,
  });
};

export const ApiPaymentRequests_Add = body => {
  // Thêm mới yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentRequests/Add',
    data: body,
  });
};

export const ApiPaymentRequests_Edit = body => {
  // Sửa yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentRequests/Edit',
    data: body,
  });
};

export const ApiPaymentRequests_Delete = body => {
  // Xóa yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentRequests/Delete',
    data: body,
  });
};

export const ApiPaymentRequests_Submit = body => {
  // Xác nhận yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentRequests/Submit',
    data: body,
  });
};

export const ApiSaleOrders_GetByCustomerID = body => {
  // Lấy danh sách đơn hàng theo kh
  return axios({
    method: 'post',
    url: 'SaleOrders/GetByCustomerID',
    data: body,
  });
};

export const ApiPaymentConfirmations_GetByID = body => {
  // Lấy thông tin chi tiết xác nhận
  return axios({
    method: 'post',
    url: 'PaymentConfirmations/GetByID',
    data: body,
  });
};

export const ApiPaymentConfirmations_Add = body => {
  // Thêm mới yêu xác nhận yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentConfirmations/Add',
    data: body,
  });
};

export const ApiPaymentConfirmations_Edit = body => {
  // Sửa xác nhận yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentConfirmations/Edit',
    data: body,
  });
};

export const ApiPaymentConfirmations_Submit = body => {
  // Xác nhận yêu cầu
  return axios({
    method: 'post',
    url: 'PaymentConfirmations/Submit',
    data: body,
  });
};

// Khiếu nại/bảo hành
export const ApiComplaints_GetMobile = () => {
  // Lấy danh sách khiếu nại/bảo hành
  return axios({
    method: 'post',
    url: 'Complaints/GetMobile',
    data: {},
  });
};

export const ApiComplaints_GetMobileByID = body => {
  // Lấy chi tiết khiếu nại/bảo hành
  return axios({
    method: 'post',
    url: 'Complaints/GetByID',
    data: body,
  });
};

export const ApiComplaints_GetSOByCusID = body => {
  // Lấy SO theo khách hàng
  return axios({
    method: 'post',
    url: 'Complaints/GetSOByCusID',
    data: body,
  });
};

export const ApiComplaints_GetODBySO = body => {
  // Lấy OD theo SO
  return axios({
    method: 'post',
    url: 'Complaints/GetODBySO',
    data: body,
  });
};

export const ApiComplaints_GetNotOD = () => {
  // Lấy phiếu điều hàng
  return axios({
    method: 'post',
    url: 'Complaints/GetNotOD',
    data: {},
  });
};

export const ApiComplaints_GetItemBySO = body => {
  // Lấy sản phẩm theo SO
  return axios({
    method: 'post',
    url: 'Complaints/GetItemBySO',
    data: body,
  });
};

export const ApiComplaints_Add = body => {
  // Thêm khiếu nại bảo hành
  return axios({
    method: 'post',
    url: 'Complaints/Add',
    data: body,
  });
};

export const ApiComplaints_Edit = body => {
  // Chỉnh sửa khiếu nại bảo hành
  return axios({
    method: 'post',
    url: 'Complaints/Edit',
    data: body,
  });
};

export const ApiComplaints_Submit = body => {
  // Khóa sửa khiếu nại bảo hành
  return axios({
    method: 'post',
    url: 'Complaints/Submit',
    data: body,
  });
};

export const ApiComplaints_UpdateRequest = body => {
  // Tiếp nhận yêu cầu
  return axios({
    method: 'post',
    url: 'Complaints/UpdateRequest',
    data: body,
  });
};

export const ApiComplaints_UpdateResponse = body => {
  // Phản hồi kết quả
  return axios({
    method: 'post',
    url: 'Complaints/UpdateResponse',
    data: body,
  });
};

export const ApiComplaints_EditProfile = body => {
  // Chỉnh sửa SO
  return axios({
    method: 'post',
    url: 'Complaints/EditProfile',
    data: body,
  });
};

export const ApiComplaints_AddProfile = body => {
  // Thêm SO
  return axios({
    method: 'post',
    url: 'Complaints/AddProfile',
    data: body,
  });
};

export const ApiComplaints_DeleteProfile = body => {
  // Xóa SO
  return axios({
    method: 'post',
    url: 'Complaints/DeleteProfile',
    data: body,
  });
};

export const ApiComplaints_SubmitProfile = body => {
  // Xác nhận SO
  return axios({
    method: 'post',
    url: 'Complaints/SubmitProfile',
    data: body,
  });
};

//  MODULES HỖ TRỢ BÁN HÀNG ---------------------------------------------------------------------

//Chương trình trưng bày
export const ApiExhibitionPrograms_GetActive = () => {
  // Lấy danh sách chương trình trưng bày
  return axios({
    method: 'post',
    url: 'Exhibitions/GetActive',
    data: {},
  });
};

export const ApiExhibitionPrograms_GetByID = body => {
  // Chi tiết chương trình trưng bày
  return axios({
    method: 'post',
    url: 'Exhibitions/GetByIDMobile',
    data: body,
  });
};

export const ApiExhibitionRegistrations_Add = body => {
  // Thêm khách hàng cho chương trình trưng bày
  return axios({
    method: 'post',
    url: 'ExhibitionRegistrations/Add',
    data: body,
  });
};

export const ApiExhibitionRegistrations_Edit = body => {
  // Chỉnh sửa khách hàng cho chương trình trưng bày
  return axios({
    method: 'post',
    url: 'ExhibitionRegistrations/Edit',
    data: body,
  });
};

export const ApiExhibitionRegistrations_Delete = body => {
  // Xóa khách hàng cho chương trình trưng bày
  return axios({
    method: 'post',
    url: 'ExhibitionRegistrations/Delete',
    data: body,
  });
};

export const ApiExhibitionRegistrations_Submit = body => {
  // Khóa or mở chương trình trưng bày
  return axios({
    method: 'post',
    url: 'ExhibitionRegistrations/Submit',
    data: body,
  });
};

export const ApiExhibitionRegistrations_GetByID = body => {
  // Chi tiết khách hàng đăng ký
  return axios({
    method: 'post',
    url: 'ExhibitionRegistrations/GetByID',
    data: body,
  });
};

export const ApiExhibitions_SaveChoices = body => {
  // Lưu kết quả trưng bày
  return axios({
    method: 'post',
    url: 'Exhibitions/SaveChoices',
    data: body,
  });
};

//Chương trình khảo sát
export const ApiMarketResearchs_GetActive = () => {
  // Lấy danh sách chương trình khảo sát
  return axios({
    method: 'post',
    url: 'ResearchMarkets/GetActive',
    data: {},
  });
};

export const ApiMarketResearchs_GetQuestions = body => {
  // Lấy danh sách chương trình khảo sát
  return axios({
    method: 'post',
    url: 'ResearchMarkets/GetByID',
    data: body,
  });
};

export const ApiMarketResearchs_SaveAnswer = body => {
  // Lấy danh sách chương trình khảo sát
  return axios({
    method: 'post',
    url: 'ResearchMarkets/SaveChoices',
    data: body,
  });
};

export const ApiMarketResearchs_GetByID = body => {
  // Lấy lịch sử chương trình khảo sát
  return axios({
    method: 'post',
    url: 'ResearchMarkets/GetByID',
    data: body,
  });
};

export const ApiResearchMarkets_GetChartData = body => {
  // Lấy dữ liệu chart
  return axios({
    method: 'post',
    url: 'ResearchMarkets/GetChartData',
    data: body,
  });
};

export const ApiExhibitionEvaluations_GetByID = body => {
  // Chi tiết kết quả đánh giá
  return axios({
    method: 'post',
    url: 'ExhibitionEvaluations/GetByID',
    data: body,
  });
};

export const ApiExhibitionRegistrations_EditImages = body => {
  // Chỉnh sửa hình ảnh
  return axios({
    method: 'post',
    url: 'ExhibitionRegistrations/EditImages',
    data: body,
  });
};

//Đào tạo và kiểm tra

export const ApiTrainings_GetActive = () => {
  // Lấy danh sách đào tạo & kiểm tra
  return axios({
    method: 'post',
    url: 'Trainings/GetAssignedTrainings',
    data: {},
  });
};

export const ApiTrainings_GetQuestions = body => {
  // Lấy danh câu hỏi training
  return axios({
    method: 'post',
    url: 'Trainings/GetQuestions',
    data: body,
  });
};

export const ApiTrainings_SaveAnswer = body => {
  // Lưu câu hỏi
  return axios({
    method: 'post',
    url: 'Trainings/SaveAnswer',
    data: body,
  });
};

export const ApiTrainings_SaveChoices = body => {
  // Nộp bài thi
  return axios({
    method: 'post',
    url: 'Trainings/SaveChoices',
    data: body,
  });
};

export const ApiTrainings_GetByID = body => {
  // Chi tiết training
  return axios({
    method: 'post',
    url: 'Trainings/GetByID',
    data: body,
  });
};

export const ApiTrainings_CheckIn = body => {
  // Điểm danh
  return axios({
    method: 'post',
    url: 'Trainings/CheckIn',
    data: body,
  });
};

export const ApiTrainings_CheckOut = body => {
  // Check out
  return axios({
    method: 'post',
    url: 'Trainings/CheckOut',
    data: body,
  });
};

// Thiết lập chi tiết PI
export const ApiPIConfigs_GetActive = () => {
  // Lấy danh sách thiết lập chi tiết PI
  return axios({
    method: 'post',
    url: 'PIConfigs/GetActive',
    data: {},
  });
};

export const ApiPIConfigs_GetByID = body => {
  // Lấy chi tiết thiết lập PI
  return axios({
    method: 'post',
    url: 'PIConfigs/GetByIDMobile',
    data: body,
  });
};

export const ApiPIConfigs_Add = body => {
  // Thêm thiết lập PI
  return axios({
    method: 'post',
    url: 'PIAllocations/Add',
    data: body,
  });
};

export const ApiPIAllocations_Edit = body => {
  // Chỉnh sửa thiết lập PI
  return axios({
    method: 'post',
    url: 'PIAllocations/Edit',
    data: body,
  });
};

export const ApiPIAllocations_GetByID = body => {
  // Chi tiết từng PI nhỏ
  return axios({
    method: 'post',
    url: 'PIAllocations/GetByIDMobile',
    data: body,
  });
};

export const ApiPIAllocations_Delete = body => {
  // Xóa PI
  return axios({
    method: 'post',
    url: 'PIAllocations/Delete',
    data: body,
  });
};

export const ApiPIAllocations_Submit = body => {
  // Submit PI
  return axios({
    method: 'post',
    url: 'PIAllocations/Submit',
    data: body,
  });
};

// Bàn giao chứng từ gốc
export const ApiHandOverDocuments_Get = () => {
  // Lấy danh sách bàn giao chứng từ
  return axios({
    method: 'post',
    url: 'HandOverDocuments/Get',
    data: {},
  });
};

export const ApiHandOverDocuments_GetByID = body => {
  // Lấy chi tiết bàn giao chứng từ
  return axios({
    method: 'post',
    url: 'HandOverDocuments/GetByID',
    data: body,
  });
};

export const ApiHandOverDocuments_Add = body => {
  // Thêm mới bàn giao chứng từ
  return axios({
    method: 'post',
    url: 'HandOverDocuments/Add',
    data: body,
  });
};

export const ApiHandOverDocuments_Edit = body => {
  // Chỉnh sửa bàn giao chứng từ
  return axios({
    method: 'post',
    url: 'HandOverDocuments/Edit',
    data: body,
  });
};

export const ApiHandOverDocuments_Delete = body => {
  // Xóa bàn giao chứng từ
  return axios({
    method: 'post',
    url: 'HandOverDocuments/Delete',
    data: body,
  });
};

export const ApiHandOverDocuments_Submit = body => {
  // Xác nhận bàn giao chứng từ
  return axios({
    method: 'post',
    url: 'HandOverDocuments/Submit',
    data: body,
  });
};

export const ApiDocumentTypes_GetActive = body => {
  // Danh sách loại chứng từ
  return axios({
    method: 'post',
    url: 'DocumentTypes/GetActive',
    data: body,
  });
};

export const ApiDocumentTypes_GetDocuments = body => {
  // Số chứng từ
  return axios({
    method: 'post',
    url: 'DocumentTypes/GetDocuments',
    data: body,
  });
};

//Chương trình khuyến mãi
export const ApiPromotionPrograms_Get = () => {
  // Danh sách chương trình khuyến mãi
  return axios({
    method: 'post',
    url: 'PromotionPrograms/GetActive',
    data: {},
  });
};

export const ApiPromotionPrograms_GetById = body => {
  // Chi tiết chương trình
  return axios({
    method: 'post',
    url: 'PromotionPrograms/GetById',
    data: body,
  });
};

//Bài viết hỗ trợ bán hàng
export const ApiPostsMedia_Get = body => {
  // Bài viết hỗ trợ bán hàng
  return axios({
    method: 'post',
    url: 'PostsMedia/GetActive',
    data: body,
  });
};

export const ApiPostsMedia_GetByID = body => {
  // Chi tiết bài viết hỗ trợ
  return axios({
    method: 'post',
    url: 'PostsMedia/GetByID',
    data: body,
  });
};

export const ApiCategoryGenerals_GetCategoryGeneralsID = body => {
  // Danh mục con của bài viết
  return axios({
    method: 'post',
    url: 'CategoryGenerals/GetCategoryGeneralsID',
    data: body,
  });
};

//Danh sách công việc
export const ApiTaskFuncs_Get = body => {
  // Danh sách công việc
  return axios({
    method: 'post',
    url: 'TaskFuncs/Get',
    data: body,
  });
};

export const ApiTaskFuncs_GetByID = body => {
  // Chi tiết công việc
  return axios({
    method: 'post',
    url: 'TaskFuncs/GetByID',
    data: body,
  });
};

export const ApiTaskFuncs_Approval = body => {
  //Phản hồi chi tiết công việc
  return axios({
    method: 'post',
    url: 'TaskFuncs/Approval',
    data: body,
  });
};

//Api lọc khách hàng
export const ApiPermissionLists_GetListUsers = body => {
  // Lọc danh sách
  return axios({
    method: 'post',
    url: 'PermissionLists/GetListUsers',
    data: body,
  });
};

export const ApiPermissionLists_GetListCustomers = body => {
  // Chi tiết công việc
  return axios({
    method: 'post',
    url: 'PermissionLists/GetListCustomers',
    data: body,
  });
};

//Chương trình quà tặng
export const ApiPromotionGifts_GetMobile = body => {
  // Danh sách chương trình
  return axios({
    method: 'post',
    url: 'PromotionGifts/GetMobile',
    data: body,
  });
};

export const ApiPromotionGifts_GetMobileByID = body => {
  // Chi tiết chương trình
  return axios({
    method: 'post',
    url: 'PromotionGifts/GetByID',
    data: body,
  });
};

export const ApiPromotionGifts_Edit = body => {
  //Chỉnh sửa chương trình quà tặng
  return axios({
    method: 'post',
    url: 'PromotionGifts/Edit',
    data: body,
  });
};

export const ApiPromotionGifts_Submit = body => {
  //Khóa chương trình
  return axios({
    method: 'post',
    url: 'PromotionGifts/Submit',
    data: body,
  });
};

export const ApiCustomerInformationExchanges_GetById = body => {
  //Lấy detail của thông tin chuyển đổi khách hàng
  return axios({
    method: 'post',
    url: 'CustomerInformationExchanges/GetById',
    data: body,
  });
};

// Đề xuất vật tư(Bảng hiệu, kệ tủ, showroom)
export const ApiDisplayCabinets_Get = () => {
  //Lấy danh sách đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayCabinets/Get',
    data: {},
  });
};

export const ApiDisplayCabinets_GetByID = body => {
  //Lấy chi tiết đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayCabinets/GetByID',
    data: body,
  });
};

export const ApiDisplayCabinets_Add = body => {
  //Thêm đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayCabinets/Add',
    data: body,
  });
};

export const ApiDisplayCabinets_Edit = body => {
  //Chỉnh sửa đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayCabinets/Edit',
    data: body,
  });
};

export const ApiDisplayCabinets_Submit = body => {
  //Khóa đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayCabinets/Submit',
    data: body,
  });
};
export const ApiExhibitions_Get = () => {
  //Lấy danh sách chương trình
  return axios({
    method: 'post',
    url: 'Exhibitions/Get',
    data: {},
  });
};

// Đề xuất vật tư(Catalogue, Sơn xe, Quà tặng)
export const ApiDisplayMaterials_GetMobile = () => {
  //Lấy danh sách đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayMaterials/Get',
    data: {},
  });
};

export const ApiDisplayMaterials_GetByID = body => {
  //Lấy chi tiết đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayMaterials/GetByID',
    data: body,
  });
};
export const Apiv2_OtherApprovals_GetByID = body => {
  return axios({
    method: 'post',
    url: 'v2/OtherApprovals/GetByID',
    data: body,
  });
};

export const ApiPromotionGifts_Get = () => {
  //Lấy danh sách chương trình tặng quà
  return axios({
    method: 'post',
    url: 'PromotionGifts/Get',
    data: {},
  });
};

export const ApiPromotionGiftPlans_GetByID = body => {
  //Lấy danh sách lý do sự kiện
  return axios({
    method: 'post',
    url: 'PromotionGiftPlans/GetByID',
    data: body,
  });
};

export const ApiItems_GetActive = () => {
  //Lấy danh sách sản phẩm
  return axios({
    method: 'post',
    url: 'Items/GetActive',
    data: {},
  });
};

export const ApiDisplayMaterials_Add = body => {
  //Thêm đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayMaterials/Add',
    data: body,
  });
};

export const ApiDisplayMaterials_Edit = body => {
  //Chỉnh sửa đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayMaterials/Edit',
    data: body,
  });
};

export const ApiDisplayMaterials_Submit = body => {
  //Khóa đề xuất vật tư
  return axios({
    method: 'post',
    url: 'DisplayMaterials/Submit',
    data: body,
  });
};

export const ApiPromotionGifts_Confirm = body => {
  //Xác nhận số lượng quà tặng
  return axios({
    method: 'post',
    url: 'PromotionGifts/Confirm',
    data: body,
  });
};
export const ApiExportPDF_ExportPDF = body => {
  //ExportPDF trình kí xét duyệt
  return axios({
    method: 'post',
    url: 'ExportPDF/ExportPDF',
    data: body,
  });
};
// duyệt
export const ApiApprovalProcess_GetById = body => {
  //ExportPDF trình kí xét duyệt
  return axios({
    method: 'post',
    url: 'ApprovalProcess/GetById',
    data: body,
  });
};
//
export const ApiCustomerEvaluation_Edit = body => {
  //ExportPDF trình kí xét duyệt
  return axios({
    method: 'post',
    url: 'CustomerEvaluation/Edit',
    data: body,
  });
};
export const ApiCustomerEvaluation_Add = body => {
  //ExportPDF trình kí xét duyệt
  return axios({
    method: 'post',
    url: 'CustomerEvaluation/Add',
    data: body,
  });
};
export const ApiCreditLimitProposal_GetInfoGuarantee = body => {
  //ExportPDF trình kí xét duyệt
  return axios({
    method: 'post',
    url: 'CreditLimitProposal/GetInfoGuarantee',
    data: body,
  });
};
export const ApiOrders_GetForCredit = body => {
  return axios({
    method: 'post',
    url: 'Orders/GetForCredit',
    data: body,
  });
};
export const ApiCustomerProfiles_GetInfo = body => {
  return axios({
    method: 'post',
    url: 'CustomerProfiles/GetInfo',
    data: body,
  });
};
export const ApiCustomerProfiles_UpdateGPS = body => {
  return axios({
    method: 'post',
    url: 'CustomerProfiles/UpdateGPS',
    data: body,
  });
};
export const ApiCustomerProfiles_GetCategoryCustomer = body => {
  return axios({
    method: 'post',
    url: 'CustomerProfiles/GetCategoryCustomer',
    data: body,
  });
};