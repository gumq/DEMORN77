import { Dimensions, Platform, StyleSheet } from "react-native";
import { hScale, scale, wScale } from "@resolutions";
import { colors, fontSize } from "@themes";

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerSearch: {
        backgroundColor: colors.white,
        width: '100%',
        paddingVertical: scale(10)
    },
    search: {
        marginHorizontal: scale(12),
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height
    },
    flatScroll: {
        // marginBottom: scale(200)
    },
    containerBody: {
        height: height,
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
        paddingBottom: scale(8)
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8),
    },
    headerProgramPI: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginVertical: scale(8)
    },
    timeProgram: {
        marginBottom: scale(4),
    },
    txtHeaderName: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginBottom: scale(4)
    },
    txtHeaderTime: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
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
    containerTime: {
        flexDirection: 'row'
    },
    bodyStatus: {
        borderRadius: scale(4),
        height: hScale(25),
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

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
    },
    footerFlat: {
        paddingBottom: scale(100)
    },
    containerHeader: {
    },
    containerHeaderForm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(12),
        marginHorizontal: scale(12),
        marginTop: scale(8),
        marginBottom: scale(4),
        alignItems: 'center'
    },
    header: {
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        color: colors.black,
        lineHeight: scale(22)
    },
    btnAdd: {
        backgroundColor: colors.white,
        borderWidth: scale(1),
        borderColor: colors.blue,
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
        borderRadius: scale(8)
    },
    txtBtnAdd: {
        fontSize: fontSize.size12,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        color: colors.blue,
        lineHeight: scale(18)
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
        borderBottomColor: colors.borderColor,
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
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
        paddingVertical: scale(12)
    },
    headerModalAdd: {
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        paddingVertical: scale(6),
        paddingHorizontal: scale(12),
    },
    titleModalAdd: {
        fontFamily: 'Inter-SemiBold',
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontWeight: '600',
        color: colors.black,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
    },
    btnFooterCancel: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(38),
        marginVertical: scale(8),
        marginHorizontal: scale(12),
        width: '45%',
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
    },
    txtBtnCancel: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnFooterModal: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginVertical: scale(8),
        marginHorizontal: scale(12),
        width: '45%',
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
    },
    txtBtnFooterModal: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    headerInput: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginBottom: scale(8),
        marginHorizontal: scale(12),
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    inputValue: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(12),
        marginBottom: scale(8),
        borderRadius: scale(8),
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.black,
        backgroundColor: '#F9FAFB',
        marginHorizontal: scale(12),
        textAlignVertical: 'top',
    },
    containerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: scale(8),
        alignItems: 'center',
        zIndex: 1,
        flexDirection: 'row',
        borderTopColor: colors.borderColor,
        borderTopWidth: scale(1)
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
    contentTitle: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        overflow: 'hidden',
        width: '80%'
    },
    contentValue: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    cardProgramCriteria: {
        backgroundColor: colors.white,
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
        marginTop: scale(8),
        paddingVertical: scale(8)
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
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8),
        width:'80%',
        overflow:'hidden'
    },
    txtHeaderTime: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    containerBodyCard: {
        flex: 1,
        marginBottom: scale(8),
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
    containerTableFile: {
        marginTop: scale(4)
    },
    bodyStatus: {
        borderRadius: scale(4),
        height: hScale(25),
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
    containerItemStatus: {
        flexDirection: 'row',
        alignItems: 'center'
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
    btnShowInfor: {
        marginRight: scale(12)
    },
    headerShowPlan: {
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginTop: scale(12),
        marginBottom: scale(4),
    },
    containerTime: {
        marginTop: scale(8)
    },
    contentCard: {
        flexDirection: 'row'
    },
    inputFormDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(8),
    },
    inputRead: {
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
        paddingVertical: scale(8),
        color: colors.black,
        overflow: 'hidden',
        height: hScale(42)
    },
    contentPlan: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(4)
    },
})

export { styles, stylesDetail, stylesProgress }