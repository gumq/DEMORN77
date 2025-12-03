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
        paddingBottom: scale(8),
    },
    search: {
        marginHorizontal: scale(12),
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
    },
    containerBody: {
        height: height,
    },
    containerBodyCard: {
        marginVertical: scale(8)
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
    contentCard: {
        marginBottom: scale(4),
        flexDirection: 'row',
        flex: 1
    },
    containerBodyText: {
        marginBottom: scale(4),
    },
    txtDescription: {
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        color: '#737373'
    },
    bodyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        marginLeft: scale(4)
    },
    contentValue: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
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
        justifyContent: 'center',
    },
    flatListContainer: {
        paddingBottom: scale(200),
    },
    tabContainer: {
        flex: 1,
        height: height,
    },
    containerFilter: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(12),
        paddingVertical: scale(8)
    },
    headerFilter: {
        fontSize: fontSize.size16,
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.black
    },
    optionsModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: height / 2.3,
    },
    contentContainer: {
        backgroundColor: colors.white,
        height: height / 2.3,
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
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor
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
    containerRadio: {
        marginHorizontal: scale(16),
        paddingBottom: scale(120)
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12),
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
    },
    cardNoBorder: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12)
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        width: '90%',
        marginLeft: scale(12),
    },
    containerFooter: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
        alignItems: 'center',
        zIndex: 1,
        flexDirection: 'row',
        borderTopColor: colors.borderColor,
        borderTopWidth: scale(1)
    },
    btnConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        height: hScale(38),
        marginHorizontal: scale(12),
        width: '48%',
        borderWidth: scale(1),
        borderColor: colors.borderColor
    },
    txtBtnConfirm: {
        color: colors.black,
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
        backgroundColor: colors.blue,
    },
    txtBtnSave: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    containerScroll: {
        marginBottom: scale(100)
    },
    line: {
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor
    }
})

const stylesInventoryDetail = StyleSheet.create({
    container: {
        flex: 1
    },
    containerTable: {
        marginBottom: scale(8),
        minWidth: '100%'
    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor
    },
    cell_40: {
        width: scale(150),
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_20: {
        width: scale(100),
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
    cellResponse: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
        backgroundColor: colors.white
    },
    lastCell: {
        borderBottomWidth: 0,
    },
    valueRow: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
});


const stylesStorageDetail = StyleSheet.create({
    container: {
        flex: 1
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
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: '100%',
    },
    flatListContainer: {
        paddingBottom: scale(200),
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
    containerBodyCard: {
        marginVertical: scale(8)
    },
    contentCard: {
        marginBottom: scale(4),
        flexDirection: 'row',
        flex: 1
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
        marginLeft: scale(4)
    },
    contentCardProduct: {
        marginBottom: scale(4),
        flexDirection: 'row',
        flex: 1
    },
    txtDetailProduct: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        flex: 1
    },
    contentDetailProduct: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        width: '80%',
        overflow: 'hidden',
        flex: 1
    },
    image: {
        marginBottom: scale(8)
    }
});

const stylesFormProposal = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: scale(50)
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: '100%',
    },
    card: {
        paddingBottom: scale(8),
        backgroundColor: colors.white,
        marginTop: scale(8)
    },
    cardFooter: {
        backgroundColor: colors.white,
        paddingBottom: scale(200)
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
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    btnAdd: {
        borderWidth: scale(1),
        borderColor: colors.blue,
        paddingVertical: scale(3),
        borderRadius: scale(4),
        marginRight: scale(12),
        paddingHorizontal: scale(8),
    },
    txtAdd: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(12),
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
    containerBodyCard: {
        marginVertical: scale(8)
    },
    contentCard: {
        marginBottom: scale(4),
        flexDirection: 'row',
        flex: 1
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
        marginLeft: scale(4)
    },
    containerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        alignItems: 'center',
        zIndex: 1,
        flexDirection: 'row',
        borderTopColor: colors.borderColor,
        borderTopWidth: scale(1)
    },
    btnConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.green,
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
        borderColor: colors.green,
        borderWidth: scale(1)
    },
    txtBtnSave: {
        color: colors.green,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    bodyCard: {
        paddingVertical: scale(8)
    }
})

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: scale(100)
    },
    scrollView: {
        height: '100%',
        backgroundColor: colors.graySystem2,
    },
    containerBody: {
        flexGrow: 1,
        paddingBottom: scale(200)
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerBodyCard: {
        flex: 1,
        marginBottom: scale(8),
    },
    cardProgram: {
        backgroundColor: colors.white,
        paddingHorizontal: scale(12),
    },
    cardBody: {
        backgroundColor: colors.white,
        paddingBottom: scale(8)
    },
    cardFooter: {
        backgroundColor: colors.white,
        paddingBottom: scale(200)
    },
    headerProgram: {
        color: colors.blue,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(24),
        marginVertical: scale(8),
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
        justifyContent: 'space-between'
    },
    containerHeaderCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(8)
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
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    contentBodySap: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginLeft: scale(4)
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
        overflow: 'hidden',
        width: '80%'
    },
    contentFile: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerTableFile: {
        marginBottom: scale(8),
    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
        marginTop: scale(8),
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
    valueRow: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        overflow: 'hidden'
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
        marginHorizontal: scale(12)
    },
    inputContent: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(42),
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
        marginTop: scale(8)
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
    containerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        alignItems: 'center',
        zIndex: 10,
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
        borderTopColor: colors.borderColor,
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
    containerBtnRenewal: {
        marginHorizontal: scale(12),
        marginTop: scale(8)
    },
    btnRenewal: {
        borderWidth: scale(1),
        borderColor: colors.blue,
        height: hScale(38),
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: scale(8),
        marginBottom: scale(8),
    },
    txtBtnRenewal: {
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.blue,
        textAlign: 'center',
    },
    containerInfor: {
        marginTop: scale(8)
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
    row: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor
    },
    cell_60: {
        width: '60%',
        justifyContent: 'center',
        paddingHorizontal: scale(8)
    },
    cell_40: {
        width: '40%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_table: {
        width: '25%',
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
    modalFile: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '90%',
        maxHeight: '90%',
        backgroundColor: colors.blueSystem2,
        borderRadius: 8,
        overflow: 'hidden'
    },
    containerFile: {
        padding: scale(8),
    },
    optionsModal: {
        margin: 0,
        height: height / 2.8,
        justifyContent: 'flex-end',
        borderTopRightRadius: scale(8),
        borderTopLeftRadius: scale(8)
    },
    optionsModalContainer: {
        backgroundColor: colors.white,
        height: height / 2.8,
        borderTopRightRadius: scale(12),
        borderTopLeftRadius: scale(12)
    },
    containerFooterModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: scale(16),
        zIndex: 1,
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
        borderTopColor: colors.borderColor,
    },
    btnFooterModal: {
        backgroundColor: colors.green,
        borderRadius: scale(8),
        height: hScale(38),
        marginTop: scale(12),
      marginBottom: scale(Platform.OS === 'ios'?24:12),
        justifyContent: 'center',
        alignContent: 'center',
    },
    txtBtnFooterModal: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        textAlign: 'center',
    },
    cardProgramModal: {
        backgroundColor: colors.white,
    },
    containerInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(8)
    },
    input: {
        flex: 1,
        marginHorizontal: scale(12)
    },
    inputCancel: {
        flex: 1,
        marginHorizontal: scale(12),
        marginBottom: scale(8)
    },
    inputView: {
        borderRadius: scale(8),
        paddingLeft: scale(10),
        height: hScale(42),
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginTop: scale(8),
        borderWidth: scale(1),
        borderColor: '#D1D3DB',
        backgroundColor: '#E5E7EB',
        paddingVertical: scale(7),
        color: colors.black
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

export { styles, stylesStorageDetail, stylesInventoryDetail, stylesFormProposal, stylesDetail, stylesProgress }