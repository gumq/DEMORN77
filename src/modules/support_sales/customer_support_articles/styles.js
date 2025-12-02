import { Dimensions, StyleSheet } from "react-native";
import { hScale, scale, wScale } from "@resolutions";
import { colors, fontSize } from "themes";

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: colors.graySystem2,
        height: height,
    },
    containerBody: {
        backgroundColor: colors.graySystem2,
        marginTop: scale(10),
        marginHorizontal: scale(12)
    },
    containerSearch: {
        backgroundColor: colors.white,
        width: '100%',
        paddingVertical: scale(10)
    },
    search: {
        marginHorizontal: scale(12),
    },
    btnAdd: {
        position: 'absolute',
        zIndex: 1,
        top: height - 50,
        right: scale(10),
        height: hScale(38),
        width: wScale(38),
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtContent: {
        marginTop: scale(4),
        alignSelf: 'center',
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        fontSize: fontSize.size14,
        lineHeight: scale(22)
    },
    imgEmpty: {
        alignSelf: 'center',
        marginTop: scale(24)
    },
    cardProgram: {
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
    contentTime: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22)
    },
    containerContent: {
        padding: scale(8),
        backgroundColor: colors.white,
        borderBottomLeftRadius: scale(8),
        borderBottomRightRadius: scale(8)
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
    img: {
        width: width - 24,
        height: hScale(200),
        alignItems: 'center',
        borderTopRightRadius: scale(12),
        borderTopLeftRadius: scale(12),
        overflow: 'hidden'
    },
    noImage: {
        width: width - 24,
        height: hScale(200),
        backgroundColor: colors.gray200,
        alignItems: 'center',
        borderTopRightRadius: scale(12),
        borderTopLeftRadius: scale(12),
        overflow: 'hidden'
    },
    imgDetail: {
        width: width,
        height: hScale(200),
        alignItems: 'center',
    },
    noImageDetail: {
        width: width,
        height: hScale(200),
        backgroundColor: colors.gray200,
        alignItems: 'center'
    },
    content: {
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: colors.black
    },
    contentDetail: {
        padding: scale(12),
        backgroundColor: colors.white,
    },
    scrollview: {
        height: height
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: scale(4),
    },
    bodyStatus: {
        borderRadius: scale(4),
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        width: 'auto',
        alignSelf: 'flex-start',
        marginTop: scale(4)
    },
    txtStatus: {
        fontSize: fontSize.size12,
        fontWeight: '500',
        lineHeight: scale(18),
        fontFamily: 'Inter-Medium',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: scale(16),
        marginTop: scale(24),
        paddingHorizontal: scale(12)
    },
    card: {
        width: Dimensions.get('window').width * 0.3,
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: scale(8),
        paddingVertical: scale(16),
        marginRight: scale(8),
    },
    iconWrapper: {
        marginBottom: 8,
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size10,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(15),
    },
    containerMenu: {
        backgroundColor: colors.graySystem2
    },
    sectionTitle: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(24),
    },
    headerSee: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: scale(12),
        marginTop: scale(12)
    },
    txtSee: {
        color: colors.blue,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginRight: scale(4)
    },
    slide: {
        width: width,
        height: hScale(200),
        resizeMode: 'cover',
    },
});

export { styles }