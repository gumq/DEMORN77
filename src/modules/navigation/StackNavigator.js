import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from '../routes';

// Import trực tiếp các màn hình
import LoginScreen from '../auth/LoginScreen';
import ChooseCompanyScreen from '../auth/ChooseCompanyScreen';
import ChooseServerScreen from '../auth/ChooseServerScreen';
import HomeScreen from '../home/HomeScreen';
import NotificationScreen from '../notify/NotificationScreen';
import SettingScreen from '../setting/SettingScreen';
import ChangePassScreen from '../setting/ChangePassScreen';
import ChangeLanguageScreen from '../setting/ChangeLanguageScreen';
import InforContactScreen from '../setting/InforContactScreen';
import EditInformationUser from '../setting/EditInformationUser';
import ApprovalSignatureScreen from '../approval_signature/ApprovalSignatureScreen';
import DetailApprovalScreen from '../../modules/approval_signature/DetailApprovalScreen';
import PlanVisitCustomerScreen from '../../modules/sell/plan_visit_customer/PlanVisitCustomerScreen';
import FormPlanVisitCustomer from '../../modules/sell/plan_visit_customer/FormPlanVisitCustomer';
import FormPlanDetailCustomer from '../../modules/sell/plan_visit_customer/FormPlanDetailCustomer';
import DetailPlanVisitCustomer from '../../modules/sell/plan_visit_customer/DetailPlanVisitCustomer';
import VisitCustomerScreen from '../../modules/sell/visit_customer/VisitCustomerScreen';
import DetailVisitCustomer from '../../modules/sell/visit_customer/DetailVisitCustomer';
import ExhibitionProgramScreen from '../../modules/support_sales/exhibition_program/ExhibitionProgramScreen';
import DetailExhibitionProgram from '../../modules/support_sales/exhibition_program/DetailExhibitionProgram';
import SurveyProgramScreen from '../../modules/support_sales/survey_program/SurveyProgramScreen';
import TakeSurveyScreen from '../../modules/support_sales/survey_program/TakeSurveyScreen';
import HistorySurveyProgramScreen from '../../modules/support_sales/survey_program/HistorySurveyProgramScreen';
import ChooseCustomerScreen from '../../modules/support_sales/survey_program/ChooseCustomerScreen';
import TrainingTestingScreen from '../../modules/support_sales/training_testing/TrainingTestingScreen';
import DetailTrainingTestingScreen from '../../modules/support_sales/training_testing/DetailTrainingTestingScreen';
import TakeTestScreen from '../../modules/support_sales/training_testing/TakeTestScreen';
import CreditLimitScreen from '../../modules/sell/credit_limit/CreditLimitScreen';
import DetailCreditLimitScreen from '../../modules/sell/credit_limit/DetailCreditLimitScreen';
import FormCreditLimitScreen from '../../modules/sell/credit_limit/FormCreditLimitScreen';
import OtherProposalScreen from '../../modules/sell/cancel_order_contract/OtherProposalScreen';
import FormOtherProposalScreen from '../../modules/sell/cancel_order_contract/FormOtherProposalScreen';
import DetailOtherProposalScreen from '../../modules/sell/cancel_order_contract/DetailOtherProposalScreen';
import CustomerProfileScreen from '../../modules/sell/customer_profile/CustomerProFileScreen';
import FormCustomerProfileScreen from '../../modules/sell/customer_profile/FormCustomerProfileScreen';
import SetUpDetailPIScreen from '../../modules/support_sales/setup_pi/SetUpDetailPIScreen';
import DetailSetUpPIScreen from '../../modules/support_sales/setup_pi/DetailSetUpPIScreen';
import ListSetUpPIScreen from '../../modules/support_sales/setup_pi/ListSetUpPIScreen';
import FormSetUpPIScreen from '../../modules/support_sales/setup_pi/FormSetUpPIScreen';
import PromotionalProgramScreen from '../../modules/support_sales/promotional_program/PromotionalProgramScreen';
import DetailPromotionProgramScreen from '../../modules/support_sales/promotional_program/DetailPromotionProgramScreen';
import CustomerRequirementScreen from '../../modules/sell/customer_request/CustomerRequirementScreen';
import FormCustomerRequirement from '../../modules/sell/customer_request/FormCustomerRequirement';
import DetailOrderRequestScreen from '../../modules/sell/customer_request/DetailOrderRequestScreen';
import DetailCusRequirementScreen from '../../modules/sell/customer_request/DetailCusRequirementScreen';
import OrdersScreen from '../../modules/sell/order/OrdersScreen';
import FormOrder from '../../modules/sell/order/FormOrders';
import CostProposalScreen from '../../modules/sell/cost_proposal/CostProposalScreen';
import DetailCostProposalScreen from '../../modules/sell/cost_proposal/DetailCostProposalScreen';
import FormCostProposal from '../../modules/sell/cost_proposal/FormCostProposal';
import InventoryRenewalScreen from '../../modules/sell/inventory_renewal/InventoryRenewalScreen';
import DetailInventoryRenewalScreen from '../../modules/sell/inventory_renewal/DetailInventoryRenewalScreen';
import CustomerClosedMoveScreen from '../../modules/sell/customer_closed_move/CustomerClosedMoveScreen';
import DetailCusClosedMoveScreen from '../../modules/sell/customer_closed_move/DetailCusClosedMoveScreen';
import FormCusClosedMoveScreen from '../../modules/sell/customer_closed_move/FormCusClosedMoveScreen';
import HandOverDocumentScreen from '../../modules/support_sales/hand_over_document/HandOverDocumentScreen';
import DetailHandOverDocScreen from '../../modules/support_sales/hand_over_document/DetailHandOverDocScreen';
import FormHandOverDocument from '../../modules/support_sales/hand_over_document/FormHandOverDocument';
import ProductQuoteScreen from '../../modules/sell/product_quote/ProductQuoteScreen';
import DetailProductQuoteScreen from '../../modules/sell/product_quote/DetailProductQuoteScreen';
import FormProductQuote from '../../modules/sell/product_quote/FormProductQuote';
import CustomerSupportArticlesScreen from '../../modules/support_sales/customer_support_articles/CustomerSupportArticlesScreen';
import DetailArticles from '../../modules/support_sales/customer_support_articles/DetailArticles';
import DetailPostTypeScreen from '../../modules/support_sales/customer_support_articles/DetailPostTypeScreen';
import DetailPostTypeDetailScreen from '../../modules/support_sales/customer_support_articles/DetailPostTypeDetailScreen';
import DepositPaymentScreen from '../../modules/sell/deposit_payment/DepositPaymentScreen';
import DetailPaymentRequestScreen from '../../modules/sell/deposit_payment/DetailPaymentRequestScreen';
import FormPaymentRequestScreen from '../../modules/sell/deposit_payment/FormPaymentRequestScreen';
import JobListScreen from '../../modules/support_sales/job_list/JobListScreen';
import DetailJobListScreen from '../../modules/support_sales/job_list/DetailJobListScreen';
import ComplaintWarrantiesScreen from '../../modules/sell/complaints_warranties/ComplaintWarrantiesScreen';
import DetailComplaintWarrantiesScreen from '../../modules/sell/complaints_warranties/DetailComplaintWarrantiesScreen';
import FormComplaintWarranties from '../../modules/sell/complaints_warranties/FormComplaintWarranties';
import GiftGivingProgramScreen from '../../modules/support_sales/gift_giving_program/GiftGivingProgramScreen';
import DetailGiftProgram from '../../modules/support_sales/gift_giving_program/DetailGiftProgram';
import CatalogueScreen from '../../modules/other_request/catalogue/CatalogueScreen';
import FormCatalogueScreen from '../../modules/other_request/catalogue/FormCatalogueScreen';
import DetailCatalogueScreen from '../../modules/other_request/catalogue/DetailCatalogueScreen';
import ShowroomScreen from '../../modules/other_request/showrooom/ShowroomScreen';
import DetailShowroomScreen from '../../modules/other_request/showrooom/DetailShowroomScreen';
import FormShowroomScreen from '../../modules/other_request/showrooom/FormShowroomScreen';
import ViewCustomerProfileScreen from '../../modules/sell/customer_profile/ViewCustomerProfileScreen';
import TabNavigator from './TabNavigator';
import Version from '../../modules/setting/Version';
import UpdateGpsScreen from '../../modules/updategps/UpdateGpsScreen';
const Stack = createNativeStackNavigator();

const screens = [
  // Authentication
  // {name: routes.LoginScreen, component: LoginScreen},
  // {name: routes.ChooseCompanyScreen, component: ChooseCompanyScreen},
  // {name: routes.ChooseServerScreen, component: ChooseServerScreen},
  // Home
  {name: routes.HomeScreen, component: HomeScreen},

  // Notification
  {name: routes.NotificationScreen, component: NotificationScreen},

  // Settings
  {name: routes.SettingScreen, component: SettingScreen},
  {name: routes.ChangePassScreen, component: ChangePassScreen},
  {name: routes.ChangeLanguageScreen, component: ChangeLanguageScreen},
  {name: routes.InforContactScreen, component: InforContactScreen},
  {name: routes.EditInformationUser, component: EditInformationUser},

  // Approval
  {name: routes.ApprovalSignatureScreen, component: ApprovalSignatureScreen},
  {name: routes.DetailApprovalScreen, component: DetailApprovalScreen},

  // Plan Visit Customer
  {name: routes.PlanVisitCustomerScreen, component: PlanVisitCustomerScreen},
  {name: routes.FormPlanVisitCustomer, component: FormPlanVisitCustomer},
  {name: routes.FormPlanDetailCustomer, component: FormPlanDetailCustomer},
  {name: routes.DetailPlanVisitCustomer, component: DetailPlanVisitCustomer},

  // Visit Customer
  {name: routes.VisitCustomerScreen, component: VisitCustomerScreen},
  {name: routes.DetailVisitCustomer, component: DetailVisitCustomer},

  // Exhibition Program
  {name: routes.ExhibitionProgramScreen, component: ExhibitionProgramScreen},
  {name: routes.DetailExhibitionProgram, component: DetailExhibitionProgram},

  // Survey Program
  {name: routes.SurveyProgramScreen, component: SurveyProgramScreen},
  {name: routes.TakeSurveyScreen, component: TakeSurveyScreen},
  {
    name: routes.HistorySurveyProgramScreen,
    component: HistorySurveyProgramScreen,
  },
  {name: routes.ChooseCustomerScreen, component: ChooseCustomerScreen},

  // Training and Testing
  {name: routes.TrainingTestingScreen, component: TrainingTestingScreen},
  {
    name: routes.DetailTrainingTestingScreen,
    component: DetailTrainingTestingScreen,
  },
  {name: routes.TakeTestScreen, component: TakeTestScreen},

  // Credit Limit
  {name: routes.CreditLimitScreen, component: CreditLimitScreen},
  {name: routes.DetailCreditLimitScreen, component: DetailCreditLimitScreen},
  {name: routes.FormCreditLimitScreen, component: FormCreditLimitScreen},

  // Cancel Order Contract
  {name: routes.OtherProposalScreen, component: OtherProposalScreen},
  {
    name: routes.DetailOtherProposalScreen,
    component: DetailOtherProposalScreen,
  },
  {name: routes.FormOtherProposalScreen, component: FormOtherProposalScreen},

  // Customer Profile
  {name: routes.CustomerProfileScreen, component: CustomerProfileScreen},
  {
    name: routes.FormCustomerProfileScreen,
    component: FormCustomerProfileScreen,
  },
  {
    name: routes.ViewCustomerProfileScreen,
    component: ViewCustomerProfileScreen,
  },
  // Set Up PI
  {name: routes.SetUpDetailPIScreen, component: SetUpDetailPIScreen},
  {name: routes.DetailSetUpPIScreen, component: DetailSetUpPIScreen},
  {name: routes.ListSetUpPIScreen, component: ListSetUpPIScreen},
  {name: routes.FormSetUpPIScreen, component: FormSetUpPIScreen},

  // Promotion Program
  {name: routes.PromotionalProgramScreen, component: PromotionalProgramScreen},
  {
    name: routes.DetailPromotionProgramScreen,
    component: DetailPromotionProgramScreen,
  },

  // Customer Requirement
  {
    name: routes.CustomerRequirementScreen,
    component: CustomerRequirementScreen,
  },
  {name: routes.DetailOrderRequestScreen, component: DetailOrderRequestScreen},
  {
    name: routes.DetailCusRequirementScreen,
    component: DetailCusRequirementScreen,
  },
  {name: routes.FormCustomerRequirement, component: FormCustomerRequirement},

  // Orders
  {name: routes.OrdersScreen, component: OrdersScreen},
  {name: routes.FormOrder, component: FormOrder},

  // Cost Proposal
  {name: routes.CostProposalScreen, component: CostProposalScreen},
  {name: routes.DetailCostProposalScreen, component: DetailCostProposalScreen},
  {name: routes.FormCostProposal, component: FormCostProposal},

  // Inventory
  {name: routes.InventoryRenewalScreen, component: InventoryRenewalScreen},
  {
    name: routes.DetailInventoryRenewalScreen,
    component: DetailInventoryRenewalScreen,
  },

  // Customer Closed Move
  {name: routes.CustomerClosedMoveScreen, component: CustomerClosedMoveScreen},
  {
    name: routes.DetailCusClosedMoveScreen,
    component: DetailCusClosedMoveScreen,
  },
  {name: routes.FormCusClosedMoveScreen, component: FormCusClosedMoveScreen},

  // HandOver Document
  {name: routes.HandOverDocumentScreen, component: HandOverDocumentScreen},
  {name: routes.DetailHandOverDocScreen, component: DetailHandOverDocScreen},
  {name: routes.FormHandOverDocument, component: FormHandOverDocument},

  // Product Quote
  {name: routes.ProductQuoteScreen, component: ProductQuoteScreen},
  {name: routes.DetailProductQuoteScreen, component: DetailProductQuoteScreen},
  {name: routes.FormProductQuote, component: FormProductQuote},

  // Support Articles
  {
    name: routes.CustomerSupportArticlesScreen,
    component: CustomerSupportArticlesScreen,
  },
  {name: routes.DetailArticles, component: DetailArticles},
  {name: routes.DetailPostTypeScreen, component: DetailPostTypeScreen},
  {
    name: routes.DetailPostTypeDetailScreen,
    component: DetailPostTypeDetailScreen,
  },

  // Deposit Payment
  {name: routes.DepositPaymentScreen, component: DepositPaymentScreen},
  {
    name: routes.DetailPaymentRequestScreen,
    component: DetailPaymentRequestScreen,
  },
  {name: routes.FormPaymentRequestScreen, component: FormPaymentRequestScreen},

  // Job List
  {name: routes.JobListScreen, component: JobListScreen},
  {name: routes.DetailJobListScreen, component: DetailJobListScreen},

  // Complaint Warranties
  {
    name: routes.ComplaintWarrantiesScreen,
    component: ComplaintWarrantiesScreen,
  },
  {
    name: routes.DetailComplaintWarrantiesScreen,
    component: DetailComplaintWarrantiesScreen,
  },
  {name: routes.FormComplaintWarranties, component: FormComplaintWarranties},

  // Gift Program
  {name: routes.GiftGivingProgramScreen, component: GiftGivingProgramScreen},
  {name: routes.DetailGiftProgram, component: DetailGiftProgram},

  // Catalogue
  {name: routes.CatalogueScreen, component: CatalogueScreen},
  {name: routes.FormCatalogueScreen, component: FormCatalogueScreen},
  {name: routes.DetailCatalogueScreen, component: DetailCatalogueScreen},

  // Showroom
  {name: routes.ShowroomScreen, component: ShowroomScreen},
  {name: routes.FormShowroomScreen, component: FormShowroomScreen},
  {name: routes.DetailShowroomScreen, component: DetailShowroomScreen},
  //
  {name: routes.Version, component: Version},
  {name: routes.UpdateGpsScreen, component: UpdateGpsScreen},
];

const MainStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={routes.LoginScreen}
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name={routes.LoginScreen} component={LoginScreen} />
    <Stack.Screen
      name={routes.ChooseServerScreen}
      component={ChooseServerScreen}
    />
    <Stack.Screen
      name={routes.ChooseCompanyScreen}
      component={ChooseCompanyScreen}
    />
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    {/* <Stack.Screen
      name={'TabNavigator'}
      component={TabNavigator}
      options={{unmountOnBlur: true}}
    /> */}
    {screens.map(screen => (
      <Stack.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
      />
    ))}
  </Stack.Navigator>
);

export {MainStackNavigator};
