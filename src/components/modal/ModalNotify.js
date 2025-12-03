import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';

import {colors, fontSize} from '@themes';
import {translateLang} from '@store/accLanguages/slide';
import {hScale, scale} from '@resolutions';
import {Button} from '../buttons';

const ModalNotify = ({
  isShowOptions,
  handleClose,
  content,
  handleAccept,
  handleCancel,
  titleContent,
  titleContent_two,
  btnNameAccept,
  btnCancel,
  titleModal,
}) => {
  const languageKey = useSelector(translateLang);

  return (
    <Modal
      useNativeDriver
      backdropOpacity={0.6}
      isVisible={isShowOptions}
      style={styles.optionsModal}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      hideModalContentWhileAnimating>
      <View style={styles.optionsModalContainer}>
        <Text style={styles.titleModalThank}>
          {titleModal ? titleModal : languageKey('_confirm')}
        </Text>
        {titleContent ? (
          <View style={styles.content}>
            <Text style={styles.titleContent}>{titleContent}</Text>
            <Text style={styles.titleContentName}> {content} </Text>
            <Text
              style={styles.titleContent}
              numberOfLines={2}
              ellipsizeMode="tail">
              {titleContent_two}
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.titleContent}>{content}</Text>
          </View>
        )}
        <View style={styles.footerModal}>
          <Button style={styles.btn} onPress={handleAccept}>
            <Text style={styles.txtBtn}>{btnNameAccept}</Text>
          </Button>
          <Button style={styles.btnDeleteModal} onPress={handleCancel}>
            <Text style={styles.txtBtnDeleteModal}>{btnCancel}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  optionsModal: {
    margin: 0,
  },
  optionsModalContainer: {
    height: 'auto',
    backgroundColor: colors.graySystem2,
    borderRadius: scale(12),
    marginHorizontal: scale(45),
  },
  headerContent_gray: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: hScale(46),
    paddingHorizontal: scale(16),
    backgroundColor: colors.graySystem2,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  contentBody: {
    flexDirection: 'row',
    padding: scale(5),
  },
  titleModalThank: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    textAlign: 'center',
    marginVertical: scale(8),
  },
  titleContent: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    textAlign: 'center',
    maxWidth: '80%',
    overflow: 'hidden',
  },
  titleContentName: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
  },
  btn: {
    height: hScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: scale(1),
    borderTopColor: '#E5E6EB',
  },
  btnDeleteModal: {
    height: hScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: scale(1),
    borderTopColor: '#E5E6EB',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: scale(16),
  },
  footerModal: {
    marginTop: scale(18),
  },
  txtBtn: {
    color: colors.blue,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    textAlign: 'center',
  },
  txtBtnDeleteModal: {
    color: '#6B7280',
    fontSize: fontSize.size16,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(24),
    textAlign: 'center',
  },
});

export default ModalNotify;
