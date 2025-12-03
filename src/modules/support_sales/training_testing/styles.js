import { Dimensions, Platform, StyleSheet } from "react-native";
import { hScale, scale } from "@resolutions";
import { colors, fontSize } from "@themes";

const { width, height } = Dimensions.get('window')

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
    flatScroll: {
        paddingBottom: scale(300)
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
        paddingHorizontal: scale(8),
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
        marginBottom: scale(8)
    },
    timeProgram: {
        marginBottom: scale(8),
        flex: 1
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
        width: '80%'
    },
    contentProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerStatus: {
        flexDirection: 'row',
        marginBottom: scale(8)
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
    bodyStatusType: {
        borderRadius: scale(4),
        height: hScale(25),
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        width: 'auto',
        marginRight: scale(4)
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

const stylesAttendance = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom:scale(200)
    },
    scrollView:{
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
        marginBottom: scale(8)
    },
    timeProgram: {
        marginBottom: scale(8),
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
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnCheck: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        height: hScale(38),
        marginVertical: scale(8),
        backgroundColor: colors.blue
    },
    txtBtnCheck: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    containerAttendance: {
        marginHorizontal: scale(12),
        backgroundColor: colors.white,
        marginTop: scale(8),
        paddingHorizontal: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8)
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: 'auto',
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
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
        paddingVertical: scale(10),
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
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
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
        marginRight: scale(4),
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
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
        marginLeft: scale(4),
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
    },
    txtBtnFooterApproval: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginTop: scale(8)
    },
    imgBox: {
        marginLeft: scale(12),
    },
    inputRead: {
        marginTop: scale(8),
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
    line: {
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
        marginVertical: scale(8)
    },
    flatFooter: {
        paddingBottom: scale(200)
    },
    containerTableFileItem: {
        marginBottom: scale(8)
    }
})

const stylesContent = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: scale(8)
    },
    timeProgram: {
        marginBottom: scale(8),
    },
    txtHeaderTime: {
        color: '#6B7280',
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
        overflow: 'hidden',
        width: '85%'
    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
        marginTop: scale(8)
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
        alignItems: 'center'
    },
    lastCell: {
        borderBottomWidth: 0,
    },
    cell: {
        padding: scale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerFlatlist: {
        paddingBottom: scale(200)
    }
})

const stylesTest = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: scale(8)
    },
    timeProgram: {
        marginBottom: scale(8),
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
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnTest: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginVertical: scale(8),
    },
    txtBtnTest: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
})

const styleTakeTest = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.graySystem
    },
    scrollView: {
        backgroundColor: colors.white,
        height: height
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
        paddingTop: scale(12),
        paddingBottom: scale(12),
        paddingHorizontal: scale(12)
    },
    totalQuestion: {
        color: colors.blue,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        textAlign: 'center',
    },
    questionText: {
        color: colors.black,
        fontSize: fontSize.size18,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(28),
        marginHorizontal: scale(12),
        marginBottom: scale(12)
    },
    optionButton: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        height: hScale(40),
        justifyContent: 'center',
        marginHorizontal: scale(12),
        marginBottom: scale(8)
    },
    optionButtonSelected: {
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(40),
        justifyContent: 'center',
        marginHorizontal: scale(12),
        marginBottom: scale(8)
    },
    optionText: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginHorizontal: scale(12)
    },
    timeRemainingText: {
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
        paddingBottom: scale(12),
        width: width,
        marginBottom: scale(12),
        textAlign: 'center'
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
    input: {
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
    }
})

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height
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
        marginBottom: scale(8)
    },
    containerResult: {
        marginBottom: scale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(8)
    },
    txtHeaderResult: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-Semibold',
        lineHeight: scale(22),
    },
    containerScore: {
        flexDirection: 'row'
    },
    txtHeaderScore: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    contentScore: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginLeft: scale(4)
    },
    bodyStatus: {
        borderRadius: scale(6),
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
    txtHeaderDetail: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-Semibold',
        lineHeight: scale(22),
        paddingVertical: scale(8)
    },
    card: {
        padding: scale(8),
        borderRadius: scale(8),
        marginBottom: scale(12),
        borderWidth: scale(1),
        borderColor: '#e0e0e0',
    },
    questionText: {
        marginBottom: scale(4),
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    answerText: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    containerAnswer: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerFlat:{
        paddingBottom:scale(300),
    },
    containerAnswer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerFlat: {
         paddingBottom:scale(200)
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
        fontStyle: 'normal',
        lineHeight: scale(24),
        marginTop: scale(16),
    },
    txtContent: {
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        alignSelf: 'center'
    },
})

const stylesResult = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: scale(8)
    },
    containerScore: {
        marginBottom: scale(8),
        flexDirection: 'row'
    },
    txtHeaderScore: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    valueScore: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginLeft: scale(4)
    },
    btnViewDetail: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(8),
        height: hScale(38),
        marginVertical: scale(8),
        borderWidth: scale(1),
        borderColor: colors.blue,
    },
    txtBtnViewDetail: {
        color: colors.blue,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
})

export { styles, stylesContent, stylesTest, styleTakeTest, stylesDetail, stylesResult, stylesAttendance }