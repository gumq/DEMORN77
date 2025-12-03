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
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBody: {
        marginBottom: scale(4),
        flex: 1
    },
    txtProposal: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        color: '#525252'
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
        width: '80%',
        overflow: 'hidden'
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
    }
})

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        height: height,
        backgroundColor: colors.graySystem2,
    },
    containerBody: {
        height: height,
    },
    footerScroll: {
        paddingBottom: scale(150)
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
        marginTop: scale(8),
        marginHorizontal: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor
    },
    cardFooter: {
        backgroundColor: colors.white,
        paddingHorizontal: scale(12),
        paddingBottom: scale(200)
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
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
        marginVertical: scale(8),
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
    btnDelete: {
        borderWidth: scale(1),
        borderColor: colors.red,
        height: hScale(38),
        width: '100%',
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
        color: colors.red,
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
    cardProgramModal: {
        backgroundColor: colors.white,
        paddingBottom: scale(80)
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
    image: {
        width: width / 4 - 24,
        height: hScale(82),
        borderRadius: scale(12),
        marginHorizontal: scale(4),
        marginTop: scale(8)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
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

const stylesFormCredit = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        height: height,
        backgroundColor: colors.graySystem2,
    },
    footerScroll: {
        paddingBottom: scale(100)
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
        backgroundColor: colors.white,
        paddingBottom: scale(8),
    },
    cardFooter: {
        backgroundColor: colors.white,
        paddingBottom: scale(8),
        marginBottom: scale(200)
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
        marginHorizontal: scale(12)
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4)
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.white,
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
    txtBtnFooterModal: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    date: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: scale(16)
    },
    inputFormDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(4)
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
    containerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        flexDirection: 'row',
        zIndex: 1,
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor
    },
    headerProgram: {
        color: colors.blue,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(24),
        marginVertical: scale(8),
        marginHorizontal: scale(12)
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
        paddingVertical: scale(7),
        color: colors.black,
    },
    headerInput: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(4),
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
    containerFooterConfirm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(8)
    },
    editBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginTop: scale(8)
    }
});

export { styles, stylesDetail, stylesProgress, stylesFormCredit }