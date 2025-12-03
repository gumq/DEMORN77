import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { SvgXml } from "react-native-svg";
import { arrow_down, arrow_right } from "@svgImg";

const CustomPicker = ({ data, selectedCustomers, onSelectCustomer }) => {
    const languageKey = useSelector(translateLang);
    const [selectedItems, setSelectedItems] = useState(selectedCustomers || []);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => setModalVisible(true);

    const closeModal = () => setModalVisible(false);

    const toggleSelectCustomer = useCallback((customer) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(c => c.ID === customer.ID);
            return isSelected
                ? prev.filter(c => c.ID !== customer.ID)
                : [...prev, customer];
        });
    }, []);

    const confirmSelection = () => {
        onSelectCustomer(selectedItems);
        closeModal();
    };

    const renderItem = useCallback(({ item }) => {
        const isSelected = selectedItems.some(c => c.ID === item.ID);
        return (
            <TouchableOpacity
                style={[styles.customerItem, isSelected && styles.selectedItem]}
                onPress={() => toggleSelectCustomer(item)}
            >
                <Text style={styles.customerName} numberOfLines={2} ellipsizeMode='tail'>
                    {item.Name}
                </Text>
            </TouchableOpacity>
        );
    }, [selectedItems, toggleSelectCustomer]);


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.picker} onPress={openModal}>
                <Text style={styles.selectedText}>{languageKey("_add_customer")} </Text>
                <SvgXml xml={modalVisible ? arrow_down : arrow_right} />
            </TouchableOpacity>
            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
                style={styles.modal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {languageKey("_customer_list")}
                    </Text>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.ID.toString()}
                        renderItem={renderItem}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews
                    />

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={confirmSelection}
                    >
                        <Text style={styles.confirmButtonText}>
                            {languageKey("_confirm")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    selectedText: {
        color: "#6B7280",
        fontSize: fontSize.size12,
        fontWeight: "400",
        fontFamily: "Inter-Regular",
        lineHeight: scale(24),
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxHeight: hScale(500)
    },
    modalTitle: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        lineHeight: scale(24),
        textAlign: "center",
        paddingVertical: scale(8),
    },
    customerItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: scale(15),
        borderBottomWidth: scale(1),
        borderBottomColor: "#eee",
    },
    selectedItem: {
        backgroundColor: "#f0f8ff",
    },
    customerName: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: "500",
        fontFamily: "Inter-Medium",
        lineHeight: scale(24),
    },
    confirmButton: {
        backgroundColor: "#007BFF",
        padding: scale(10),
        borderRadius: scale(8),
        alignItems: "center",
        marginTop: scale(10),
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        lineHeight: scale(22),
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
});

export default CustomPicker;
