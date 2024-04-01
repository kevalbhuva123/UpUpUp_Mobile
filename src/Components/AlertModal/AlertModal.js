import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';

const AlertModal = props => {
  const {modalVisible, onClose, heading, content, Icon, subContent} = props;
  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <View style={styles.root}>
        <View style={styles.main}>
          {Icon && (
            <Icon
              height={scale(43)}
              width={scale(43)}
              alignSelf="center"
              marginBottom={scale(15)}
            />
          )}
          {heading && <Text style={styles.headingText}>{heading}</Text>}
          {content && <Text style={styles.contentText}>{content}</Text>}
          {subContent && <Text style={styles.contentText}>{subContent}</Text>}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.modalBG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: Color.white,
    width: '90%',
    borderRadius: scale(20),
    paddingHorizontal: scale(19),
    paddingVertical: scale(25),
  },
  headingText: {
    fontSize: scale(14),
    fontFamily: Fonts.semibold,
    color: Color.black,
    textAlign: 'center',
    paddingHorizontal: scale(2),
  },
  contentText: {
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    color: Color.black,
    textAlign: 'center',
    marginTop: scale(16),
    paddingHorizontal: scale(8),
  },
  button: {
    backgroundColor: Color.icon,
    borderRadius: scale(100),
    padding: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    marginTop: scale(24),
  },
  buttonText: {
    fontSize: scale(16),
    fontFamily: Fonts.semibold,
    color: Color.white,
    textAlign: 'center',
  },
});
