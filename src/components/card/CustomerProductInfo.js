// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable prettier/prettier */
// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
// } from 'react-native';
// import {SvgXml} from 'react-native-svg';
// import Modal from 'react-native-modal';

// import {colors, fontSize} from '@themes';
// import {hScale, scale} from '@utils/resolutions';;
// import SearchBar from '@components/SearchBar';
// import {Button} from '@components/buttons';
// import {arrow_down, close_blue, close_white, radio, radio_active} from '@svgImg';
// import {useSelector} from 'react-redux';
// import {translateLang} from '@store/accLanguages/slide';
// import SearchModal from '@components/SearchModal';

// const {width, height} = Dimensions.get('window');

// const CustomerProductInfo = ({
//   setData,
//   data,
//   disable = false,
//   view = false,
// }) => {
//   const languageKey = useSelector(translateLang);
//   const {listCustomerGroup, listProductTypes} = useSelector(
//     state => state.CustomerProfile,
//   );
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isShowModal, setIsShowModal] = useState({
//     type: null,
//     isVisible: false,
//   });
//   const [activeItem, setActiveItem] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
// console.log('listCustomerGroup',listCustomerGroup)
//   useEffect(() => {
//     let parsed = [];
//     if (typeof data === 'string') {
//       try {
//         parsed = JSON.parse(data);
//       } catch (e) {
//         console.error('Invalid JSON', e);
//       }
//     } else if (Array.isArray(data)) {
//       parsed = data;
//     }
//     if (parsed.length) {
//       const da = parsed.map(({BusinessSectorID, CustomerGroup}) => ({
//         goodstypes:
//           listProductTypes.find(p => p.ID === BusinessSectorID) || null,
//         customergroup:
//           listCustomerGroup.find(
//             c => c.ID === CustomerGroup?.[0]?.CustomerGroupID,
//           ) || null,
//       }));
//       setSelectedItems(da);
//     }
//   }, [data, listProductTypes, listCustomerGroup]);
// // console.log('listProductTypes',listProductTypes)
//   const openModal = (type, index) => {
//     setActiveItem(index);
//     setIsShowModal({type, isVisible: true});
//   };

//   const closeModal = () => {
//     setIsShowModal({type: null, isVisible: false});
//     setActiveItem(null);
//   };

//   const handleSelection = (type, item) => {
//     setSelectedItems(prev => {
//       const newItems = [...prev];
//       if (activeItem !== null) {
//         newItems[activeItem] = {
//           ...newItems[activeItem],
//           [type]: item,
//         };
//       }
//       return newItems;
//     });
//     setSelectedItem(item);
//     closeModal();
//   };

//   useEffect(() => {
//     setData(
//       selectedItems.map(({goodstypes, customergroup}) => ({
//         BusinessSectorID: goodstypes?.ID,
//         CustomerGroup: customergroup
//           ? [{CustomerGroupID: customergroup?.ID}]
//           : [],
//       })),
//     );
//   }, [selectedItems]);

//   const onChangeText = textSearch => {
//     setSearchText(textSearch);
//     if (textSearch?.length) {
//       const dataSource =
//         isShowModal.type === 'goodstypes'
//           ? listProductTypes
//           : listCustomerGroup;
//       setSearchResults(SearchModal(dataSource, textSearch));
//     } else {
//       setSearchResults(
//         isShowModal.type === 'goodstypes'
//           ? listProductTypes
//           : listCustomerGroup,
//       );
//     }
//   };

//   useEffect(() => {
//     setSearchResults(
//       isShowModal.type === 'goodstypes'
//         ? listProductTypes
//         : listCustomerGroup,
//     );
//   }, [listCustomerGroup, listProductTypes, isShowModal]);

//   const renderItemModal = useCallback(
//     ({item}) => (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() => handleSelection(item?.CategoryType.toLowerCase(), item)}>
//         <Text style={styles.title}>{item.Name}</Text>
//       </TouchableOpacity>
//     ),
//     [handleSelection],
//   );
//   return (
//     <View style={styles.containerCustomer}>
//       <Text
//         style={
//           view === true ? styles.containerHeader1 : styles.containerHeader
//         }>
//         {languageKey('_customer_product_infor')}
//       </Text>
//       <View style={styles.containerTable}>
//         {disable === false && (
//           <View style={styles.categoryAllItem}>
//             <Text style={styles.txtIndustry}>
//               {languageKey('_product_industry')}
//             </Text>
//             <Text style={styles.txtCustomerHeader}>
//               {languageKey('_customer_group')}
//             </Text>
//           </View>
//         )}
//         <FlatList
//           data={disable === false ? [...selectedItems, {}] : [...selectedItems]}
//           keyExtractor={(item, index) => index.toString()}
//           initialNumToRender={12}
//           maxToRenderPerBatch={20}
//           windowSize={12}
//           removeClippedSubviews={true}
//           ListEmptyComponent={
//             <Text
//               style={[
//                 {
//                   justifyContent: 'center',
//                   alignSelf: 'center',
//                   textAlign: 'center',
//                 },
//                 styles.categoryValue,
//               ]}>
//               {languageKey('_no_data')}
//             </Text>
//           }
//           renderItem={({item, index}) => {
//             console.log('item',item)
//             return (
//               <View
//                 style={
//                   disable === false
//                     ? styles.categoryItem
//                     : [selectedItem]?.length - 1 === index
//                     ? view === true
//                       ? styles.categoryItemdis1
//                       : styles.categoryItemdis0
//                     : styles.categoryItemdis
//                 }>
//                 <Button
//                   style={view ? styles.selectButton1 : styles.selectButton}
//                   onPress={() => {
//                     disable === false && openModal('goodstypes', index);
//                   }}>
//                   <Text
//                     style={
//                       item.goodstypes
//                         ? view === true
//                           ? styles.categoryValueview
//                           : styles.categoryValue
//                         : styles.categoryText
//                     }>
//                     {item.goodstypes?.Name || languageKey('_add_industry')}
//                   </Text>
//                   {disable === false && <SvgXml xml={arrow_down} />}
//                 </Button>
//                 <Button
//                   style={[
//                     view ? styles.selectButton1 : styles.selectButton,
//                     {marginLeft: scale(0)},
//                   ]}
//                   onPress={() => {
//                     disable === false && openModal('customergroup', index);
//                   }}>
//                   <Text
//                     numberOfLines={2}
//                     ellipsizeMode="tail"
//                     style={
//                       item.customergroup
//                         ? view === true
//                           ? styles.categoryValueview2
//                           : styles.categoryValue
//                         : styles.categoryText
//                     }>
//                     {item.customergroup?.Name ||
//                       languageKey('_select_customer_group')}
//                   </Text>
//                   {disable === false && <SvgXml xml={arrow_down} />}
//                 </Button>
//               </View>
//             );
//           }}
//         />
//       </View>
//       <Modal
//         transparent={true}
//         visible={isShowModal.isVisible}
//         style={styles.optionsModal}
//         onBackButtonPress={closeModal}
//         onBackdropPress={closeModal}
//         avoidKeyboard={true}
//         hideModalContentWhileAnimating>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.headerContent_gray}>
//               <View style={styles.btnClose}>
//                 <SvgXml xml={close_white} />
//               </View>
//               <Text style={styles.titleModal}>
//                 {' '}
//                 {isShowModal.type === 'goodstypes'
//                   ? languageKey('_product_industry')
//                   : languageKey('_customer_group')}
//               </Text>
//               <Button onPress={closeModal} style={styles.btnClose}>
//                 <SvgXml xml={close_blue} />
//               </Button>
//             </View>
//             <View style={styles.search}>
//               <SearchBar
//                 value={searchText}
//                 onChangeText={text => {
//                   setSearchText(text);
//                   onChangeText(text);
//                 }}
//               />
//             </View>
//             <FlatList
//               data={searchResults}
//               keyExtractor={item => item.ID.toString()}
//               renderItem={renderItemModal}
//               initialNumToRender={10}
//               maxToRenderPerBatch={20}
//               windowSize={5}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   containerCustomer: {
//     flex: 1,
//     paddingHorizontal: scale(12),
//   },
//   containerHeader: {
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     lineHeight: scale(24),
//     fontFamily: 'Inter-SemiBold',
//     color: colors.blue,
//     marginTop: scale(8),
//     marginBottom: scale(8),
//   },
//   containerHeader1: {
//     fontSize: fontSize.size114,
//     fontWeight: '600',
//     lineHeight: scale(22),
//     fontFamily: 'Inter-SemiBold',
//     color: colors.gray52,
//     marginTop: scale(8),
//     marginBottom: scale(8),
//   },
//   containerTable: {
//     borderWidth: scale(1),
//     borderColor: colors.borderColor,
//     borderRadius: scale(8),
//   },
//   containerCheckbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: width / 2.8,
//   },
//   optionsModal: {
//     margin: 0,
//     justifyContent: 'flex-end',
//   },
//   modalOverlay: {
//     flex: 1,
//     height: 500,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: colors.white,
//     borderTopLeftRadius: scale(12),
//     borderTopRightRadius: scale(12),
//     height: height / 2.2,
//   },
//   headerContent_gray: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     height: hScale(46),
//     paddingHorizontal: scale(16),
//     backgroundColor: colors.white,
//     borderTopLeftRadius: scale(24),
//     borderTopRightRadius: scale(24),
//   },
//   titleModal: {
//     color: colors.black,
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(24),
//     textAlign: 'center',
//     flex: 1,
//   },
//   txtIndustry: {
//     width: width / 2,
//     fontSize: fontSize.size12,
//     fontWeight: '600',
//     lineHeight: scale(18),
//     fontFamily: 'Inter-SemiBold',
//     color: '#525252',
//   },
//   txtCustomerHeader: {
//     fontSize: fontSize.size12,
//     fontWeight: '600',
//     lineHeight: scale(18),
//     fontFamily: 'Inter-SemiBold',
//     color: '#525252',
//   },
//   categoryAllItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: scale(10),
//     borderBottomWidth: scale(1),
//     borderBottomColor: colors.borderColor,
//     paddingHorizontal: scale(8),
//     backgroundColor: '#FAFAFA',
//   },
//   categoryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: scale(10),
//     borderBottomWidth: scale(1),
//     borderBottomColor: colors.borderColor,
//     paddingHorizontal: scale(8),
//     backgroundColor: colors.white,
//   },
//   categoryItemdis: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: scale(1),
//     borderBottomColor: colors.borderColor,
//     paddingHorizontal: scale(8),
//     backgroundColor: colors.white,
//     borderRadius: scale(8),
//     paddingVertical: scale(12),
//   },
//   categoryItemdis0: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // borderBottomWidth: scale(1),
//     // borderBottomColor: colors.borderColor,
//     paddingHorizontal: scale(8),
//     backgroundColor: colors.white,
//     borderRadius: scale(8),
//     paddingVertical: scale(12),
//   },
//   categoryItemdis1: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // borderBottomWidth: scale(1),
//     // borderBottomColor: colors.borderColor,
//     paddingHorizontal: scale(8),
//     backgroundColor: colors.white,
//     borderRadius: scale(8),
//     paddingVertical: scale(16),
//   },
//   categoryValue: {
//     fontSize: fontSize.size12,
//     fontWeight: '400',
//     lineHeight: scale(18),
//     fontFamily: 'Inter-Regular',
//     color: colors.black,
//     width: '70%',
//   },
//   categoryValueview: {
//     fontSize: fontSize.size16,
//     fontWeight: '400',
//     lineHeight: scale(24),
//     fontFamily: 'Inter-Regular',
//     color: colors.black,
//     width: '100%',
//     marginLeft: scale(6),
//   },
//   categoryValueview2: {
//     fontSize: fontSize.size16,
//     fontWeight: '400',
//     lineHeight: scale(24),
//     fontFamily: 'Inter-Regular',
//     color: colors.gray52,
//     width: '100%',
//     marginLeft: scale(6),
//   },
//   categoryText: {
//     fontSize: fontSize.size12,
//     fontWeight: '600',
//     lineHeight: scale(18),
//     fontFamily: 'Inter-Regular',
//     color: '#525252',
//     width: '70%',
//   },
//   selectButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: width / 2,
//   },
//   selectButton1: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: width / 2.3,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: hScale(46),
//     paddingHorizontal: scale(16),
//     backgroundColor: colors.white,
//     borderTopLeftRadius: scale(24),
//     borderTopRightRadius: scale(24),
//   },
//   titleModal: {
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     textAlign: 'center',
//     flex: 1,
//     color: colors.black,
//   },
//   search: {
//     marginHorizontal: scale(16),
//     marginBottom: scale(16),
//     marginTop: scale(16),
//   },
//   card: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: scale(10),
//     borderBottomWidth: 1,
//     borderBottomColor: '#D1D3DB',
//     marginHorizontal: scale(16),
//     alignItems: 'center',
//   },
//   title: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//   },
//   radioIcon: {
//     marginTop: scale(2),
//   },
//   btnClose: {
//     padding: scale(10),
//   },
//   cardNoBorder: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: scale(10),
//     marginHorizontal: scale(16),
//   },
// });

// export default CustomerProductInfo;
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Modal from 'react-native-modal';

import {colors, fontSize} from '@themes';
import {hScale, scale} from '@utils/resolutions';
import SearchBar from '@components/SearchBar';
import {Button} from '@components/buttons';
import {arrow_down, close_blue, close_white, radio, radio_active} from '@svgImg';
import {useSelector} from 'react-redux';
import {translateLang} from '@store/accLanguages/slide';
import SearchModal from '@components/SearchModal';

const {width, height} = Dimensions.get('window');

const CustomerProductInfo = ({
  setData,
  data,
  disable = false,
  view = false,
}) => {
  const languageKey = useSelector(translateLang);
  const {listCustomerGroup, listProductTypes} = useSelector(
    state => state.CustomerProfile,
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [isShowModal, setIsShowModal] = useState({
    type: null,
    isVisible: false,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // console.log('selectedItems',selectedItems)
  const getDefaultCustomerGroup = () => {
    if (!Array.isArray(listCustomerGroup) || listCustomerGroup.length === 0)
      return null;
    let def = listCustomerGroup.find(
      c => c.Code && String(c.Code).toUpperCase() === 'D',
    );
    if (!def) {
      def =
        listCustomerGroup.find(c => c.Code === 'D') ||
        listCustomerGroup[listCustomerGroup.length - 1];
    }
    return def;
  };
  const getDefaultProductTypes = () => {
    if (!Array.isArray(listProductTypes) || listProductTypes.length === 0)
      return null;
    let def = listProductTypes.find(
      c => c.Code && String(c.Code).toUpperCase() === '00',
    );
    if (!def) {
      def =
        listProductTypes.find(c => c.Code === '00') ||
        listProductTypes[listProductTypes.length - 1];
    }
    return def;
  };
  // console.log('listProductTypes', listProductTypes);
  useEffect(() => {
    const defaultGroup = getDefaultCustomerGroup();
    const defaultProductTypes = getDefaultProductTypes();
    let parsed = [];
    if (typeof data === 'string') {
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON', e);
        parsed = [];
      }
    } else if (Array.isArray(data)) {
      parsed = data;
    }

    // if parsed empty and disable === false, create a single row prefilled with default
    if (!parsed || parsed.length === 0) {
      if (disable === false) {
        const initial = [
          {
            goodstypes: defaultProductTypes,
            customergroup: defaultGroup,
          },
        ];
        setSelectedItems(initial);
        return;
      } else {
        setSelectedItems([]);
        return;
      }
    }

    // map parsed items to selectedItems shape, and if customergroup missing set to defaultGroup
    const da = parsed.map(({BusinessSectorID, CustomerGroup}) => {
      const goodstypes =
        listProductTypes.find(p => p.ID === BusinessSectorID) || null;

      // If CustomerGroup exists and has CustomerGroupID pick corresponding listCustomerGroup item
      let customergroup = null;
      if (Array.isArray(CustomerGroup) && CustomerGroup.length > 0) {
        const cgId = CustomerGroup[0]?.CustomerGroupID;
        customergroup = listCustomerGroup.find(c => c.ID === cgId) || null;
      }

      // If no customergroup found, set default
      if (!customergroup && defaultGroup) {
        customergroup = defaultGroup;
      }

      return {
        goodstypes,
        customergroup,
      };
    });

    setSelectedItems(da);
  }, [data, listProductTypes, listCustomerGroup, disable]);

  const openModal = (type, index) => {
    setActiveItem(index);
    setIsShowModal({type, isVisible: true});
  };

  const closeModal = () => {
    setIsShowModal({type: null, isVisible: false});
    setActiveItem(null);
  };

  const handleSelection = item => {
    // item param is the selected object from modal, its CategoryType indicates goodstypes or customergroup
    const type = item?.CategoryType?.toLowerCase();
    if (!type) {
      closeModal();
      return;
    }
    setSelectedItems(prev => {
      const newItems = [...prev];
      if (activeItem !== null) {
        newItems[activeItem] = {
          ...newItems[activeItem],
          [type]: item,
        };
      }
      return newItems;
    });
    setSelectedItem(item);
    closeModal();
  };

  useEffect(() => {
    setData(
      selectedItems.map(({goodstypes, customergroup}) => ({
        BusinessSectorID: goodstypes?.ID,
        CustomerGroup: customergroup
          ? [{CustomerGroupID: customergroup?.ID}]
          : [],
      })),
    );
  }, [selectedItems]);

  const onChangeText = textSearch => {
    setSearchText(textSearch);
    if (textSearch?.length) {
      const dataSource =
        isShowModal.type === 'goodstypes'
          ? listProductTypes
          : listCustomerGroup;
      setSearchResults(SearchModal(dataSource, textSearch));
    } else {
      setSearchResults(
        isShowModal.type === 'goodstypes'
          ? listProductTypes
          : listCustomerGroup,
      );
    }
  };

  useEffect(() => {
    setSearchResults(
      isShowModal.type === 'goodstypes' ? listProductTypes : listCustomerGroup,
    );
  }, [listCustomerGroup, listProductTypes, isShowModal]);

  const renderItemModal = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelection(item)}>
        <Text style={styles.title}>{item.Name}</Text>
      </TouchableOpacity>
    ),
    [handleSelection],
  );

  return (
    <View style={styles.containerCustomer}>
      <Text
        style={
          view === true ? styles.containerHeader1 : styles.containerHeader
        }>
        {languageKey('_customer_product_infor')}
      </Text>
      <View style={styles.containerTable}>
        {disable === false && (
          <View style={styles.categoryAllItem}>
            <Text style={styles.txtIndustry}>
              {languageKey('_product_industry')}
            </Text>
            <Text style={styles.txtCustomerHeader}>
              {languageKey('_customer_group')}
            </Text>
          </View>
        )}
        <FlatList
          data={disable === false ? [...selectedItems, {}] : [...selectedItems]}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={12}
          maxToRenderPerBatch={20}
          windowSize={12}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <Text
              style={[
                {
                  justifyContent: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                },
                styles.categoryValue,
              ]}>
              {languageKey('_no_data')}
            </Text>
          }
          renderItem={({item, index}) => {
            return (
              <View
                style={
                  disable === false
                    ? styles.categoryItem
                    : [selectedItem]?.length - 1 === index
                    ? view === true
                      ? styles.categoryItemdis1
                      : styles.categoryItemdis0
                    : styles.categoryItemdis
                }>
                <Button
                  style={view ? styles.selectButton1 : styles.selectButton}
                  onPress={() => {
                    disable === false && openModal('goodstypes', index);
                  }}>
                  <Text
                    style={
                      item.goodstypes
                        ? view === true
                          ? styles.categoryValueview
                          : styles.categoryValue
                        : styles.categoryText
                    }>
                    {item.goodstypes?.Name || languageKey('_add_industry')}
                  </Text>
                  {disable === false && <SvgXml xml={arrow_down} />}
                </Button>
                <Button
                  style={[
                    view ? styles.selectButton1 : styles.selectButton,
                    {marginLeft: scale(0)},
                  ]}
                  onPress={() => {
                    disable === false && openModal('customergroup', index);
                  }}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={
                      item.customergroup
                        ? view === true
                          ? styles.categoryValueview2
                          : styles.categoryValue
                        : styles.categoryText
                    }>
                    {item.customergroup?.Name ||
                      languageKey('_select_customer_group')}
                  </Text>
                  {disable === false && <SvgXml xml={arrow_down} />}
                </Button>
              </View>
            );
          }}
        />
      </View>
      <Modal
        transparent={true}
        visible={isShowModal.isVisible}
        style={styles.optionsModal}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        avoidKeyboard={true}
        hideModalContentWhileAnimating>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerContent_gray}>
              <View style={styles.btnClose}>
                <SvgXml xml={close_white} />
              </View>
              <Text style={styles.titleModal}>
                {' '}
                {isShowModal.type === 'goodstypes'
                  ? languageKey('_product_industry')
                  : languageKey('_customer_group')}
              </Text>
              <Button onPress={closeModal} style={styles.btnClose}>
                <SvgXml xml={close_blue} />
              </Button>
            </View>
            <View style={styles.search}>
              <SearchBar
                value={searchText}
                onChangeText={text => {
                  setSearchText(text);
                  onChangeText(text);
                }}
              />
            </View>
            <FlatList
              data={searchResults}
              keyExtractor={item => item.ID.toString()}
              renderItem={renderItemModal}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              windowSize={5}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerCustomer: {
    flex: 1,
    paddingHorizontal: scale(12),
  },
  containerHeader: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.blue,
    marginTop: scale(8),
    marginBottom: scale(8),
  },
  containerHeader1: {
    fontSize: fontSize.size114,
    fontWeight: '600',
    lineHeight: scale(22),
    fontFamily: 'Inter-SemiBold',
    color: colors.gray52,
    marginTop: scale(8),
    marginBottom: scale(8),
  },
  containerTable: {
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
  },
  containerCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2.8,
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    height: 500,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    height: height / 2.2,
  },
  headerContent_gray: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: hScale(46),
    paddingHorizontal: scale(16),
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  titleModal: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    textAlign: 'center',
    flex: 1,
  },
  txtIndustry: {
    width: width / 2,
    fontSize: fontSize.size12,
    fontWeight: '600',
    lineHeight: scale(18),
    fontFamily: 'Inter-SemiBold',
    color: '#525252',
  },
  txtCustomerHeader: {
    fontSize: fontSize.size12,
    fontWeight: '600',
    lineHeight: scale(18),
    fontFamily: 'Inter-SemiBold',
    color: '#525252',
  },
  categoryAllItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(10),
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
    paddingHorizontal: scale(8),
    backgroundColor: '#FAFAFA',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(10),
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
    paddingHorizontal: scale(8),
    backgroundColor: colors.white,
  },
  categoryItemdis: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
    paddingHorizontal: scale(8),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  categoryItemdis0: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: scale(1),
    // borderBottomColor: colors.borderColor,
    paddingHorizontal: scale(8),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },
  categoryItemdis1: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: scale(1),
    // borderBottomColor: colors.borderColor,
    paddingHorizontal: scale(8),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingVertical: scale(16),
  },
  categoryValue: {
    fontSize: fontSize.size12,
    fontWeight: '400',
    lineHeight: scale(18),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    width: '70%',
  },
  categoryValueview: {
    fontSize: fontSize.size16,
    fontWeight: '400',
    lineHeight: scale(24),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    width: '100%',
    marginLeft: scale(6),
  },
  categoryValueview2: {
    fontSize: fontSize.size16,
    fontWeight: '400',
    lineHeight: scale(24),
    fontFamily: 'Inter-Regular',
    color: colors.gray52,
    width: '100%',
    marginLeft: scale(6),
  },
  categoryText: {
    fontSize: fontSize.size12,
    fontWeight: '600',
    lineHeight: scale(18),
    fontFamily: 'Inter-Regular',
    color: '#525252',
    width: '70%',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2,
  },
  selectButton1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2.3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hScale(46),
    paddingHorizontal: scale(16),
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  titleModal: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    color: colors.black,
  },
  search: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    marginTop: scale(16),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#D1D3DB',
    marginHorizontal: scale(16),
    alignItems: 'center',
  },
  title: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  radioIcon: {
    marginTop: scale(2),
  },
  btnClose: {
    padding: scale(10),
  },
  cardNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    marginHorizontal: scale(16),
  },
});

export default CustomerProductInfo;
