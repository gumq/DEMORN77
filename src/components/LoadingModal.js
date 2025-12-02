import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import { colors } from '@themes';

const LoadingModal = ({ visible }) => {
  return (
    <Modal isVisible={visible} style={styles.modal} backdropOpacity={0}>
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingModal;
