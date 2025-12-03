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
        height: '100%'
    },
    containerBody: {
        height: '100%'
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
        marginTop: scale(8),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
        paddingBottom: scale(8)
    },
    cardItem: {
        backgroundColor: '#F5F5F5',
        marginHorizontal: scale(8),
        borderRadius: scale(8),
        paddingHorizontal: scale(8),
        paddingBottom: scale(8),
        marginBottom:scale(8),
        paddingTop:scale(8)
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8)
    },
    containerBody: {
        flex: 1,
        marginBottom: scale(4),
    },
    txtProposal: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        color: '#525252'
    },
    bodyCard: {
        marginBottom: scale(8)
    },
    itemBody: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtHeaderBody: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentBody: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    contentBodyKes: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerFooterCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(4)
    },
    contentTimeApproval: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
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
    flatListContainer: {
        paddingBottom: scale(200)
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBodyText: {
        marginTop: scale(4)
    }
})

const stylesComplaintForm = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
        marginBottom: scale(55)
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
    card: {
        paddingBottom: scale(8),
        paddingTop: scale(8)
    },
    headerCard: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.blue,
        marginTop: scale(12),
        marginHorizontal: scale(12),
        marginBottom: scale(4),
    },
    inputAuto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(4)
    },
    widthInput: {
        flex: 1,
        marginHorizontal: scale(12),
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    txtHeaderInputView: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    inputView: {
        borderRadius: scale(8),
        paddingLeft: scale(10),
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginTop: scale(8),
        borderWidth: scale(1),
        borderColor: '#D1D3DB',
        backgroundColor: '#E5E7EB',
        paddingVertical: scale(8),
        color: colors.black,
        overflow: 'hidden',
        height: hScale(42)
    },
   headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft: scale(12),
        marginTop: scale(8),
    },
    imgBox: {
        marginLeft: scale(12)
    },
    date: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginHorizontal: scale(12),
        width: '48%'
    },
    txtBtnConfirm: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnSave: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        height: hScale(38),
        width: '48%',
        borderColor: colors.borderColor,
        borderWidth: scale(1)
    },
    txtBtnSave: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    optionsModal: {
        margin: 0,
        justifyContent: 'flex-end',
        borderTopRightRadius: scale(8),
        borderTopLeftRadius: scale(8)
    },
    optionsModalContainer: {
        backgroundColor: colors.white,
        height: 'auto',
        borderTopRightRadius: scale(12),
        borderTopLeftRadius: scale(12)
    },
    contentContainer: {
        height: 'auto',
    },
    containerFile: {
        // padding: scale(8),
    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
        marginTop: scale(8)
    },
    confirmationButton: {
        borderRadius: scale(8),
        justifyContent: 'center',
        backgroundColor: colors.orange,
        marginTop: scale(25),
        marginBottom: scale(18),
        height: scale(45)
    },
    titleButton: {
        color: colors.white,
        fontWeight: '500',
        textAlign: 'center',
    },
    containerFileUpload: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: scale(12)
    },
    txtHeaderFile: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(4)
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
    contentTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerTableFile: {
        marginBottom: scale(8),
        paddingHorizontal: scale(12),
    },
    rowTable: {
        borderColor: colors.borderColor,
        borderWidth: 1
    },
    cell: {
        padding: scale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnDoc: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: scale(16),
        paddingVertical: scale(8),
        alignItems: 'center',
        zIndex: 1,
        flexDirection: 'row',
        borderTopColor: colors.borderColor,
        borderTopWidth: scale(1)
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor
    },
    rowTable: {
        flexDirection: 'row',
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    cell_60: {
        width: '60%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_40: {
        width: '40%',
        alignItems: 'flex-end',
        justifyContent: 'center',
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
    btnShowInfor: {
        marginRight: scale(12)
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputFormDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(4)
    },
    containerAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: scale(12),
        marginBottom: scale(4)
    },
    inputRead: {
        width: '45%',
        marginHorizontal: scale(12),
        marginBottom: scale(8)
    },
    inputReadDeliverer: {
        flex: 1,
        marginHorizontal: scale(12),
        marginBottom: scale(8)
    },
    containerRadio: {
        marginHorizontal: scale(12),
        marginVertical: scale(8)
    },
    label: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    row: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center'
    },
    radio: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    }
});

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        height: height,
        backgroundColor: colors.graySystem2,
    },
    flatScroll: {
        paddingBottom: scale(200)
    },
    containerBody: {
        flexGrow: 1,
        paddingBottom: scale(200)
    },
    cardProgram: {
        backgroundColor: colors.white,
        paddingHorizontal: scale(8),
        paddingBottom: scale(8),
        paddingTop: scale(8),
        borderRadius: scale(8),
        marginHorizontal: scale(12),
        marginTop: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor
    },
    headerModalApproval: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(24),
        marginVertical: scale(8),
        textAlign: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
        paddingVertical: scale(8)
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        width:'70%',
        overflow:'hidden'
    },
    btnShowInfor: {
        marginRight: scale(12)
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
        alignItems: 'center',
        width: '55%'
    },
    headerInput: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(4),
    },
    inputNote: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
        paddingVertical: scale(12),
        borderRadius: scale(8),
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.black,
        textAlignVertical: 'top',
        backgroundColor: '#F9FAFB',
        marginTop: scale(8),
        marginHorizontal: scale(12)
    },
    headerInputForm: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(4),
        marginTop: scale(8)
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
        marginBottom: scale(8)
    },
    headerProgramForm: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    containerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
        alignItems: 'center',
        zIndex: 10,
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
    },
    btnFooter: {
        backgroundColor: colors.blue,
        height: hScale(38),
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: scale(8),
    },
    txtBtnFooter: {
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.white,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        marginHorizontal: scale(12)
    },
    containerContentBody: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBodyCard: {
        flex: 1,
        marginBottom: scale(4),
    },
    txtHeaderBody: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentBody: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    cardCustomer: {
        backgroundColor: colors.white,
        paddingHorizontal: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        marginVertical: scale(8),
        paddingVertical: scale(8)
    },
    contentCard: {
        marginBottom: scale(8)
    },
    txtHeaderCard: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(18),
        marginBottom: scale(8)
    },
    cardProgramDetail: {
        backgroundColor: colors.white,
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
    txtTitleItem: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
    },
    bodyCard: {
        marginHorizontal: scale(8),
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(4)
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerFlat: {
        marginBottom: scale(8)
    },
    btnDetail: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        height: hScale(38),
        justifyContent: 'center',
        marginTop: scale(8)
    },
    txtBtnDetail: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        textAlign: 'center'
    },
    contentDetail: {
        marginBottom: scale(8),
        marginHorizontal: scale(12)
    },
    valueDetail: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
        overflow: 'hidden',
        width: '90%'
    },
    containerBodyDetail: {
        flex: 1,
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
    btnFooterCancel: {
        flex: 1,
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(4)
    },
    txtBtnFooterCancel: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnFooterApproval: {
        flex: 1,
        backgroundColor: colors.blue,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(4)
    },
    txtBtnFooterApproval: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    txtHeaderUpdate: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(24),
        marginBottom: scale(4),
        marginHorizontal: scale(12)
    },
    txtProposal: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: '#525252',
    },
    contentInfoModal: {
        marginHorizontal: scale(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(4)
    },
    containerAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnUploadItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: scale(6),
        borderWidth: scale(1),
        borderColor: colors.blue,
        width: 'auto',
        paddingHorizontal: scale(4)
    },
    txtBtnUploadItem: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginLeft: scale(4)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(8),
        marginHorizontal: scale(8)
    },
    line: {
        borderWidth: scale(0.5),
        borderColor: colors.borderColor,
        marginHorizontal: scale(8)
    },
    containerHeaderShow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerShow: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginTop: scale(12),
        marginHorizontal: scale(12),
        marginBottom: scale(4),
    },
})

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


export { styles, stylesComplaintForm, stylesDetail, stylesProgress }