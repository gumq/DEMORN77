import { Dimensions, Platform, StyleSheet } from "react-native";
import { hScale, scale } from "@resolutions";
import { colors, fontSize } from "@themes";

const { height } = Dimensions.get('window')

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
    flatScroll: {
        paddingBottom: scale(116)
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
        width: '60%',
        overflow: 'hidden'
    },
    content: {
        color: colors.black,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(18),
        paddingVertical: scale(8)
    },
    txtHeaderTime: {
        color: '#525252',
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        marginTop: scale(8),
        lineHeight: scale(22),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: scale(8),
        marginTop: scale(8)
    },
    btnHistory: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        borderRadius: scale(8),
        height: hScale(38),
        width: '48%'
    },
    txtBtnHistory: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnTakeSurvey: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        width: '48%'
    },
    txtBtnTakeSurvey: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: scale(12)
    },
    card: {
        paddingVertical: scale(10),
        marginLeft: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#D1D3DB',
        width: '90%',
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    cardNoBorder: {
        paddingVertical: scale(10),
        marginLeft: scale(12),
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
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
    },
    optionsModalContainerAdd: {
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        overflow: 'hidden',
        maxHeight: height / 1.39,
    },
    contentContainerAdd: {
        backgroundColor: colors.white,
        maxHeight: height / 1.39,
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
});

const styleTakeSurvey = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.graySystem
    },
    scrollView: {
        height: height,
        backgroundColor: colors.graySystem2,
        paddingTop: scale(12)
    },
    flatScroll: {
        paddingBottom: scale(200)
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: scale(12),
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
        paddingHorizontal: scale(12),
        backgroundColor: colors.graySystem2,
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
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor
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

const stylesHistory = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
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
    row: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        marginTop: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    rowTable: {
        flexDirection: 'row',
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    cell_40: {
        width: '40%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_10: {
        width: '15%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_25: {
        width: '25%',
        justifyContent: 'center',
        padding: scale(8)
    },
    cell_30: {
        width: '30%',
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
    containerFlat:{
        paddingBottom:scale(200)
    }
})

export { styles, styleTakeSurvey, stylesHistory }