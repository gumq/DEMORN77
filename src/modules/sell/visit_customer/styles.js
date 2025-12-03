import { Dimensions, Platform, StyleSheet } from "react-native";
import { hScale, scale, wScale } from "@resolutions";
import { colors, fontSize } from "@themes";

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
    },
    flatScroll: {
        paddingBottom: scale(150)
    },
    containerSearch: {
        backgroundColor: colors.white,
        width: '100%',
        paddingVertical: scale(10)
    },
    search: {
        marginHorizontal: scale(12),
    },
    containerBody: {
    },
    optionsModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: 'auto',
    },
    contentContainer: {
        backgroundColor: colors.white,
        height: 'auto',
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
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
        alignItems: 'center'
    },
    cardNoBorder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
        width: '90%',
        paddingBottom: scale(8)
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
        alignSelf: 'center',
        color: '#525252'
    },
    containerCard: {
        backgroundColor: colors.white,
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        marginHorizontal: scale(12),
        marginTop: scale(8)
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(8),
        paddingTop: scale(8)
    },
    contentHeader: {
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        maxWidth: '70%',
        overflow: 'hidden',
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
    viewDate: {
        paddingHorizontal: scale(8),
        flex: 1
    },
    txtDate: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.gray600,
    },
    contentDate: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(4),
        marginBottom: scale(8)
    },
    containerStatus: {
        flexDirection: 'row',
        paddingHorizontal: scale(8),
        marginTop: scale(8),
        marginBottom: scale(8)
    },
    viewContent: {
        flex: 1,
        flexDirection: 'row',
        marginTop: scale(4),
    },
    content: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
    },
    contentVisit: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.blue,
    },
    contentRevenue: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.green,
    },
    containerDashboard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(8),
        backgroundColor: colors.white,
        paddingHorizontal: scale(12),
        paddingTop: scale(8),
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor
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
    inputFormDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(4)
    },
    btnConfirm: {
        backgroundColor: colors.blue,
        height: hScale(38),
        marginVertical: scale(8),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: scale(8),
    },
    txtBtnConfirm: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.white,
    }
});

const stylesDetail = StyleSheet.create({
    container: {
        flex: 1
    },
    safe: {
        flex: 1
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
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
        marginTop: scale(8)
    },
    timeProgram: {
        flexDirection: 'row',
        marginBottom: scale(8),
    },
    contentProgram: {
        marginBottom: scale(4)
    },
    txtHeaderContent: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginRight: scale(4)
    },
    content: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        overflow: 'hidden',
        width: '80%'
    },
    contentTime: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(8)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginTop: scale(8)
    },
    imageStyle: {
        width: width / 4,
        height: hScale(82),
        borderRadius: scale(12),
        marginBottom: scale(16),
        marginRight: scale(16),
        marginTop: scale(4)
    },
    flatListContent: {
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
    },
    btnConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginBottom: scale(16),
    },
    btnConfirmCheck: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginBottom: scale(16),
        width: '48%'
    },
    txtBtnConfirm: {
        color: colors.blue,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    containerHeaderInventory: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btnAddInventory: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: colors.blue,
        borderRadius: scale(8),
        paddingHorizontal: scale(11),
        height: hScale(28),
        marginVertical: scale(8)
    },
    txtBtnAddInventory: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(18)
    },
    cardProgramBottom: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(12),
        borderRadius: scale(6),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
        marginBottom: scale(80)
    },
    headerInput: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginBottom: scale(8),
        marginTop: scale(4)
    },
    inputContent: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(12),
        paddingVertical: scale(4),
        borderRadius: scale(8),
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.black,
        backgroundColor: '#F9FAFB',
    },
    optionsModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height:'auto',
    },
    contentContainer: {
        backgroundColor: colors.white,
        height:'auto',
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
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4)
    },
    footerModal: {
        width: width,
        paddingHorizontal: scale(12),
        borderTopWidth: scale(1),
        borderTopColor: colors.borderColor,
        paddingTop: scale(8),
        marginTop:scale(16)
    },
    btnAddProduct: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(38),
        marginBottom: scale(16)
    },
    txtAddProduct: {
        color: colors.blue,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    containerProduct: {
        borderWidth: scale(1),
        borderRadius: scale(6),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        marginBottom: scale(8),
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: scale(4)
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productTitle: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.gray600,
    },
    productName: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft: scale(4),
        width: '75%',
        overflow: 'hidden',
    },
    deleteButton: {
        padding: scale(5)
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewContentRow: {
        marginTop: scale(4),
    },
    viewContent: {
        width: '50%'
    },
    txtTitle: {
        marginTop: scale(4),
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: '#525252'
    },
    txtValue: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        color: colors.black,
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(4),
        marginBottom: scale(8)
    },
})


export { styles, stylesDetail }