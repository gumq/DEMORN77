import { Dimensions, StyleSheet } from "react-native";
import { hScale, scale, wScale } from "@resolutions";
import { colors, fontSize } from "@themes";

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerSearch: {
        backgroundColor: colors.white,
        width: '100%',
        paddingBottom: scale(10),
        paddingTop: scale(10)
    },
    search: {
        marginHorizontal: scale(12),
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height
    },
    flatFooter: {
        paddingBottom: scale(200)
    },
    containerBody: {
        height: height
    },
    imgEmpty: {
        alignSelf: 'center',
        marginTop: scale(24)
    },
    txtHeaderNodata: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        alignSelf: 'center',
        lineHeight: scale(24),
        marginTop: scale(16),
    },
    txtContent: {
        marginTop: scale(4),
        alignSelf: 'center',
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: '#525252'
    },
    imgEmpty: {
        alignSelf: 'center',
        marginTop: scale(24)
    },
    cardProgram: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
    },
    timeProgram: {
        flexDirection: 'row',
        marginTop: scale(8)
    },
    txtHeaderTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        alignSelf: 'center',
        lineHeight: scale(22),
    },
    contentTime: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22)
    },
    img: {
        width: width - 24,
        height: hScale(200),
        alignItems: 'center',
        borderTopRightRadius: scale(12),
        borderTopLeftRadius: scale(12),
        overflow: 'hidden'
    },
    containerContent: {
        padding: scale(8)
    },
    btnAdd: {
        position: 'absolute',
        zIndex: 1,
        bottom: scale(16),
        right: scale(10),
        height: hScale(38),
        width: wScale(38),
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: scale(200)
    },
    cardProgram: {
        backgroundColor: colors.white,
        paddingHorizontal: scale(8),
        paddingBottom: scale(8)
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8)
    },
    timeProgram: {
        flexDirection: 'row',
        marginTop: scale(8)
    },
    txtHeaderTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        alignSelf: 'center',
        lineHeight: scale(22),
    },
    contentTime: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22)
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: scale(8)
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    cellResponse: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
    },
    lastCell: {
        borderBottomWidth: 0,
    },
    cell_70: {
        width: '70%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_50: {
        width: '50%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_30: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: scale(8)
    },
    cell_25: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: scale(8)
    },
    txtHeaderTable: {
        color: '#6B7280',
        fontSize: fontSize.size12,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(18),
    },
    txtValueTable: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        color: colors.black,
    },
    cardProduct: {
        marginBottom: scale(8)
    },
    img: {
        width: width,
        height: hScale(200),
        alignItems: 'center',
    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
        marginTop: scale(8)
    },
    tableWrapperDetail: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
        marginTop: scale(8)
    },
    btnUploadFile: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: scale(6),
        marginTop: scale(12),
        borderWidth: scale(1),
        borderColor: colors.blue,
        width: 'auto',
        paddingHorizontal: scale(4)
    },
    txtBtnUploadFile: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginLeft: scale(4)
    },
    txtHeaderCard: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(18),
        width: '80%',
        overflow: 'hidden'
    },
    containerImage: {
        marginBottom: scale(6),
        marginTop: scale(6)
    },
    txtImageModal: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: scale(12),
        marginBottom: scale(4)
    },
    header: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginTop: scale(12),
        marginHorizontal: scale(12),
    },
    optionsModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainerAdd: {
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        overflow: 'hidden',
    },
    contentContainerAdd: {
        backgroundColor: colors.white,
        maxHeight: height / 1.2,
    },
    headerContentAdd: {
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
    cardCustomer: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(8),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    itemBody_two: {
        flexDirection: 'row',
        borderRadius: scale(12),
        padding: scale(8)
    },
    containerItem: {
        justifyContent: 'flex-end',
        flex: 1
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txtTitleItem: {
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        overflow: 'hidden',
        width: '90%'
    },
    containerText: {
        flex: 1,
        marginBottom: scale(8)
    },
    content: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        width: '90%',
        overflow: 'hidden'
    },
    txtHeader: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    txtTime: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginBottom: scale(4)
    },
    containerFooter: {
        marginTop: scale(8)
    },
    btnConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginHorizontal: scale(8),
    },
    txtBtnConfirm: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
});

const stylesCustomers = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollview: {
        marginBottom: scale(300)
    },
    imgEmpty: {
        alignSelf: 'center',
        marginTop: scale(24)
    },
    txtHeaderNodata: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        alignSelf: 'center',
        lineHeight: scale(24),
        marginTop: scale(16),
    },
    txtContent: {
        marginTop: scale(4),
        alignSelf: 'center',
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        fontSize: fontSize.size14,
        lineHeight: scale(22)
    },
    cardProgram: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8),
        width: '100%',
        overflow: 'hidden'
    },
    contentProgram: {
        marginBottom: scale(4),
    },
    contentProgramCard: {
        marginBottom: scale(4),
        flex: 1
    },
    txtHeaderContent: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    content: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentTime: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    btnCancel: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        borderRadius: scale(8),
        height: hScale(38),
        width: '48%'
    },
    txtBtnCancel: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        width: '48%'
    },
    txtBtnConfirm: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
        maxHeight: height / 1.5,
    },
    modalContainerDetail: {
        backgroundColor: colors.white,
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        maxHeight: height / 1.5,
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.graySystem2,
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        paddingVertical: scale(12),
        paddingHorizontal: scale(12),
    },
    titleModal: {
        fontFamily: 'Inter-SemiBold',
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontWeight: '600',
        color: colors.black,
        flex: 1,
        textAlign: 'center',
    },
    footer: {
        backgroundColor: colors.white,
        borderTopColor: colors.borderColor,
        borderTopWidth: scale(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(12),
        paddingVertical: scale(8)
    },
    input: {
        marginBottom: scale(8),
        borderRadius: scale(8),
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.gray600,
        textAlignVertical: 'top',
        marginHorizontal: scale(12),
        marginTop: scale(12)
    },
    headerInput: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginBottom: scale(8),
        marginHorizontal: scale(12),
        marginTop:scale(8)
    },
    inputContent: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        borderRadius: scale(8),
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.black,
        textAlignVertical: 'top',
        backgroundColor: '#F9FAFB',
        marginHorizontal: scale(12)
    },
    imgBox: {
        marginLeft: scale(12),
        // marginTop: scale(12),
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft:scale(12),
        marginTop:scale(8)
    },
    imageStyle: {
        width: width / 4 - 24,
        height: hScale(82),
        borderRadius: scale(12),
        marginHorizontal: scale(4),
        marginTop: scale(8)
    },
    flatListContent: {
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
        paddingBottom: scale(150),
    },
    btnUpdateImage: {
        backgroundColor: colors.blue,
        height: hScale(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        marginVertical: scale(8),
        width: '48%'
    },
    txtUpdateImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.white,
    },
    btnViewImage: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        marginVertical: scale(8),
        width: '48%'
    },
    txtViewImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.black,
    },
    modalUpdateImage: {
        margin: 0,
    },
    modalContainerUpdateImage: {
        width: width,
        height: hScale(200),
        bottom: 0,
        position: 'absolute',
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
    },
    cameraGalleryContainer: {
        marginBottom: scale(8),
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
    },
    takePhotoBtn: {
        borderBottomWidth: scale(1),
        borderBottomColor: '#D1D3DB',
        paddingVertical: scale(12),
    },
    takeChoose: {
        borderBottomWidth: scale(1),
        borderBottomColor: '#D1D3DB',
        paddingVertical: scale(12),
    },
    chooseGalleryBtn: {
        paddingVertical: scale(12),
        borderBottomWidth: scale(1),
        borderBottomColor: '#D1D3DB',
    },
    txtTakeChoose: {
        fontSize: fontSize.size16,
        color: colors.black,
        paddingHorizontal: scale(10),
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold'
    },
    txtTakePhoto: {
        fontSize: fontSize.size14,
        color: colors.black,
        paddingHorizontal: scale(10),
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium'
    },
    txtBtn: {
        fontSize: fontSize.size14,
        color: colors.white,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold'
    },
    cancelButton: {
        height: hScale(38),
        borderRadius: scale(8),
        backgroundColor: colors.green,
        marginTop: scale(4),
        marginHorizontal: scale(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainerEdit: {
        width: width,
        height: 'auto',
        bottom: 0,
        position: 'absolute',
    },
    containerButtonEdit: {
        marginBottom: scale(8),
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        borderRadius: scale(8)
    },
    editBtn: {
        borderBottomWidth: scale(1),
        borderBottomColor: '#D1D3DB',
        paddingVertical: scale(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteBtn: {
        paddingVertical: scale(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtModalBtn: {
        fontSize: fontSize.size16,
        color: colors.black,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold'
    },
    txtDelete: {
        fontSize: fontSize.size16,
        color: colors.red,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold'
    },
    cancelButtonModal: {
        height: hScale(38),
        borderRadius: scale(8),
        backgroundColor: colors.white,
        marginTop: scale(4),
        marginHorizontal: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(8)
    },
    bodyStatus: {
        borderRadius: scale(4),
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        width: 'auto',
    },
    txtStatus: {
        fontSize: fontSize.size12,
        fontWeight: '500',
        lineHeight: scale(18),
        fontFamily: 'Inter-Medium',
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white
    },
    header: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginTop: scale(12),
        marginHorizontal: scale(12),
        marginBottom: scale(4),
    },
    btnShowInfor: {
        marginRight: scale(12)
    },
    containerTab: {
        flexDirection: 'row',
        borderRadius: scale(8),
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(8)
    },
    btn: {
        paddingVertical: scale(4),
        width: width / 4.3
    },
    btnActive: {
        backgroundColor: colors.blue,
        marginVertical: scale(2),
        borderRadius: scale(6),
        marginLeft: scale(2),
        paddingHorizontal: scale(8),
        paddingVertical: scale(4)
    },
    textActive: {
        fontWeight: '400',
        color: colors.white,
        fontSize: fontSize.size12,
        fontFamily: 'Inter-Regular',
        lineHeight: scale(18),
        textAlign: 'center'
    },
    text: {
        fontWeight: '400',
        color: '#525252',
        fontSize: fontSize.size12,
        fontFamily: 'Inter-Regular',
        lineHeight: scale(18),
        textAlign: 'center'
    },
    containerFooterCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal:scale(8),
        marginBottom:scale(8)
    },
    contentTimeApproval: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    btnCancelModal: {
        padding: scale(2)
    },
    txtCancelModal: {
        color: colors.blue,
        fontSize: fontSize.size16,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(24),
    },
    containerImage: {
        marginLeft: scale(8),
        marginBottom: scale(12)
    },
    txtImageModal: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginLeft: scale(4),
        marginTop: scale(8)
    }
});

const stylesProgress = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(16),
        backgroundColor: '#fff',
        height: height
    },
    list: {
        paddingBottom: scale(16),
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    circle: {
        width: scale(16),
        height: scale(16),
        borderRadius: 10,
        backgroundColor: '#D1D3DB',
        position: 'absolute',
    },
    redCircle: {
        backgroundColor: 'red',
    },
    line: {
        width: scale(4),
        height: scale(50),
        backgroundColor: '#D1D3DB',
        position: 'absolute',
        left: scale(6),
        top: scale(22),
    },
    stopText: {
        marginLeft: scale(30),
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
    },
    boldText: {
        fontWeight: 'bold',
    },
    separator: {
    },
    txtDate: {
        marginTop: scale(8),
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        fontFamily: 'Inter-Regular',
        color: colors.gray600,
        fontWeight: '400',
        marginLeft: scale(30),
        marginBottom: scale(4),
    },
    txtApprove: {
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        fontFamily: 'Inter-Regular',
        color: colors.black,
        fontWeight: '400',
        marginLeft: scale(30),
        marginBottom: scale(8)
    },
});


export { styles, stylesDetail, stylesCustomers, stylesProgress }