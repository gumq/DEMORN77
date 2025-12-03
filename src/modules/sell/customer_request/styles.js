import { Dimensions, Platform, StyleSheet } from "react-native";
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
        marginTop: scale(8),
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
    },
    containerBody: {
        flexDirection: 'row',
        marginBottom: scale(4),
        width: '80%'
    },
    txtProposal: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        color: colors.black
    },
    bodyCard: {
        marginVertical: scale(8)
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
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginLeft: scale(4),
        width:'80%',
        overflow:'hidden'

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
        marginBottom: scale(8)
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
    contentView: {
        marginBottom: scale(4)
    }
});

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
    },
    footerScroll: {
        paddingBottom: scale(130)
    },
    containerBody: {
        marginBottom: scale(4),
        flex: 1,
    },
    containerBodyDynamic: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginBottom: scale(4),
    },
    containerGeneralInfor: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
    },
    containerBodyCard: {
        marginBottom: scale(4),
    },
    cardProgram: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
        marginTop: scale(8),
        paddingBottom: scale(8)
    },
    cardProgramStep: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        paddingHorizontal: scale(8),
        borderColor: colors.borderColor,
        marginBottom: scale(500)
    },
    cardModalTab: {
        backgroundColor: colors.white,
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
        marginTop: scale(8)
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8),
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(8)
    },
    bodyStatus: {
        borderRadius: scale(4),
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        width: 'auto',
        marginTop: scale(8)
    },
    txtStatus: {
        fontSize: fontSize.size12,
        fontWeight: '500',
        lineHeight: scale(18),
        fontFamily: 'Inter-Medium',
    },
    bodyCard: {
        marginVertical: scale(8)
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
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        width: '80%',
        overflow: 'hidden'
    },
    contentBodyColumn: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    txtHeaderDoc: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    contentTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentProduct: {
        color: colors.black,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(18),
        overflow: 'hidden',
        justifyContent: "flex-end"
    },
    containerTableFile: {
        marginVertical: scale(8)

    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
    },
    rowTable: {
        borderTopWidth: scale(0),
    },
    cell: {
        padding: scale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
    },
    rowTableFileResponse: {
        flexDirection: 'row',
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
    btnDoc: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerRadio: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
        alignItems: 'center',
        width: '55%'
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        width: '90%',
        marginLeft: scale(4)
    },
    headerInput: {
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
    containerFooter: {
        position: 'absolute',
        top: height - 215,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        alignItems: 'center',
        zIndex: 1,
    },
    btnFooter: {
        backgroundColor: colors.blue,
        height: hScale(38),
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: scale(8),
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
    },
    txtBtnFooter: {
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.white,
        textAlign: 'center',
    },
    containerButtton: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnDelete: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(38),
        width: '48%',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: scale(8),
        marginBottom: scale(8)
    },
    txtBtnDelete: {
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    btnConfirm: {
        backgroundColor: colors.blue,
        height: hScale(38),
        width: '48%',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: scale(8),
        marginBottom: scale(8)
    },
    txtBtnConfirm: {
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.white,
        textAlign: 'center',
    },
    containerInfor: {
        marginTop: scale(8)
    },
    containerInforForm: {
        marginTop: scale(8),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formResponse: {
        marginBottom: scale(200)
    },
    containerInforRespon: {
        marginBottom: scale(200)
    },
    containerFileUpload: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginTop: scale(8),
        borderWidth: scale(1),
        borderColor: colors.blue,
        width: 'auto',
        paddingHorizontal: scale(4),
        marginBottom: scale(8)
    },
    txtBtnUploadFile: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginLeft: scale(4)
    },
    containerFooter: {
        marginVertical: scale(8)
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor
    },
    cell_60: {
        width: '60%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_40_product: {
        width: '40%',
        padding: scale(8)
    },
    cell_40: {
        width: '40%',
        padding: scale(8),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    cell_20: {
        width: '20%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: scale(8)
    },
    lastCell: {
        borderBottomWidth: 0,
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
    containerHeaderColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(4)
    },
    inputCard: {
        marginTop: scale(8)
    },
    modal: {
        paddingBottom: scale(500)
    },
    containerTabApprovalKes: {
        marginHorizontal: scale(12),
    },
    image: {
        width: width / 4 - 24,
        height: hScale(82),
        borderRadius: scale(12),
        marginHorizontal: scale(4),
        marginTop: scale(8)
    },
    containerImage: {
        marginBottom: scale(8)
    },
    inputForm: {
        marginTop: scale(8)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
    },
    containerTableFileItem: {
        marginBottom: scale(8)
    },
    line: {
        borderWidth: scale(0.5),
        borderColor: colors.borderColor,
    },
    lineDetail: {
        borderWidth: scale(0.5),
        borderColor: colors.borderColor,
        marginTop: scale(8)
    }
})

const stylesProgress = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(16),
        backgroundColor: colors.white,
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

const stylesFormOrderRequest = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
    },
    footerScroll: {
        paddingBottom: scale(60)
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
    card: {
        paddingBottom: scale(8),
        borderTopWidth: scale(1),
        borderTopColor: '#D4D4D4'
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
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: width,
        height: hScale(200),
        bottom: 0,
        position: 'absolute',
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.graySystem2,
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
        paddingVertical: scale(6),
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
    btnFooterModal: {
        alignItems: 'center',
        backgroundColor: colors.red,
        borderRadius: scale(8),
        height: hScale(38),
        paddingVertical: scale(Platform.OS === "android" ? 6 : 8),
        marginTop: scale(12),
  marginBottom: scale(Platform.OS === 'ios'?24:12),
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
        paddingBottom: scale(200)
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
        padding: 8,
        alignItems: 'center',
        zIndex: 1,
        flexDirection: 'row',
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor
    },
    containerFooterForm: {
        flexDirection: 'row',
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
    imgBox: {
        marginLeft: scale(12),
        marginTop: scale(8),
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
    },
    imageStyle: {
        width: width / 4 - 24,
        height: hScale(82),
        borderRadius: scale(12),
        marginHorizontal: scale(4),
        marginTop: scale(8)
    },
    inputForm: {
        marginTop: scale(8)
    }
});

export { styles, stylesDetail, stylesProgress, stylesFormOrderRequest }