import { configureStore } from '@reduxjs/toolkit';

import LoginReducer from 'store/accAuth/slide';
import LanguageReducer from 'store/accLanguages/slide';
import HomeReducer from 'store/accHome/slide';
import NotifyReducer from 'store/accNotify/slide';
import GPSReducer from 'store/accGPS/slide';
import ApprovalProcessReducer from 'store/accApproval_Signature/slide';
import VisitCustomerReducer from 'store/accVisit_Customer/slide';
import ExhibitionProgramsReducer from 'store/accExhibition_Programs/slide';
import SurveyProgramReducer from 'store/accSurvey_Program/slide';
import TrainingTestingReducer from 'store/accTraining_Testing/slide';
import CreditLimitReducer from 'store/accCredit_Limit/slide';
import OtherProposalReducer from 'store/accOther_Proposal/slide';
import CustomerProfileReducer from 'store/accCustomer_Profile/slide';
import SetUpDetailPIReducer from 'store/accSetup_PI/slide';
import CusRequirementReducer from 'store/accCus_Requirement/slide';
import OrderReducer from 'store/accOrders/slide';
import CostProposalReducer from 'store/accCost_Proposal/slide';
import InventoryReducer from 'store/accInventory/slide';
import CustomerCloseMoveReducer from 'store/accCus_Closed_Move/slide';
import HandOverDocReducer from 'store/accHand_Over_Doc/slide';
import PromotionProgramReducer from 'store/accPromotion_Program/slide';
import ProductQuoteReducer from 'store/accProduct_Quote/slide';
import SupportArticlesReducer from 'store/accCustomer_Support_Articles/slide';
import PaymentReducer from 'store/accDeposit_Payment/slide';
import JobListReducer from 'store/accJob_List/slide';
import ComplaintWarrantiesReducer from 'store/acc_Complaint_Warranties/slide';
import GiftPromotionReducer from 'store/accGift_Program/slide'

const rootReducer = {
    Login: LoginReducer,
    Language: LanguageReducer,
    Home: HomeReducer,
    Notify: NotifyReducer,
    GPS: GPSReducer,
    ApprovalProcess: ApprovalProcessReducer,
    VisitCustomer: VisitCustomerReducer,
    ExhibitionPrograms: ExhibitionProgramsReducer,
    SurveyPrograms: SurveyProgramReducer,
    TrainingTesting: TrainingTestingReducer,
    CreditLimit: CreditLimitReducer,
    OtherProposal: OtherProposalReducer,
    CustomerProfile: CustomerProfileReducer,
    SetUpDetailPI: SetUpDetailPIReducer,
    CusRequirement: CusRequirementReducer,
    Orders: OrderReducer,
    CostProposal: CostProposalReducer,
    Inventory: InventoryReducer,
    CustomerCloseMove: CustomerCloseMoveReducer,
    HandOverDoc: HandOverDocReducer,
    PromotionPrograms: PromotionProgramReducer,
    ProductQuote: ProductQuoteReducer,
    SupportArticles : SupportArticlesReducer,
    Payments : PaymentReducer,
    JobList: JobListReducer,
    ComplaintWarranties: ComplaintWarrantiesReducer,
    GiftProgram: GiftPromotionReducer
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
});


