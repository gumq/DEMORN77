import {
  setIsSubmitting,
  updateMenu,
  updateMenu_home,
  updateMenu_me,
  updateTabnavigator,
} from '../accHome/slide';
import {ApiGetMenuRightByGroupID} from '../../action/Api';

const fetchMenu = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiGetMenuRightByGroupID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        // dispatch(setIsSubmitting(false))
        // await new Promise(resolve => {
        //   dispatch(updateMenu(result));
        //   resolve();
        // });
        const parents = result.filter(item => item.ParentID === '0');
        const childrenOfParents = result.filter(item =>
          parents.some(parent => parent?.MenuID === item?.ParentID),
        );
        const tab1Parent = result.find(item => item.Extention20 === 'tab1');
        const tab1Children = tab1Parent
          ? result.filter(item => item?.ParentID === tab1Parent?.MenuID)
          : [];
        const tab5Parent = result.find(item => item?.Extention20 === 'tab5');
        const tab5Children = tab5Parent
          ? result.filter(item => item?.ParentID === tab5Parent?.MenuID)
          : [];
        const groupedMenus = tab1Children?.map((parent, index) => {
          const childExtention = `tab1_${index + 1}`;
          const children = result?.filter(
            item => item?.Extention20 === childExtention,
          );
          return {
            ...parent,
            children,
          };
        });
        dispatch(updateTabnavigator(childrenOfParents));
        // dispatch(updateMenu(tab1Children));
        dispatch(updateMenu_me(tab5Children));
        dispatch(updateMenu_home(groupedMenus));
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

export {fetchMenu};
