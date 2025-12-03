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
    flatContainer: {
        paddingBottom: scale(120)
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
        lineHeight: scale(22),
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
});




export { styles }