import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scale} from '../../utlis/Scale';
import Color from '../../Constants/Color';
import Fonts from '../../Constants/Fonts';

const LogoutModal = props => {
  const {title, description, modalVisible, onCancel, onYes} = props;
  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <View style={styles.root}>
        <View style={styles.main}>
          <Text style={styles.contentText}>{title}</Text>

          <Text style={styles.contentText}>
            {description}
            <Text style={styles.subContentText}>Logout?</Text>
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={[styles.button, {width: '45%'}]}
              onPress={() => {
                onYes();
              }}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {width: '45%'}]}
              onPress={() => {
                onCancel();
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

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
  contentText: {
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    color: Color.black,
    textAlign: 'center',
    marginTop: scale(12),
    paddingHorizontal: scale(8),
  },
  subContentText: {
    fontSize: scale(14),
    fontFamily: Fonts.semibold,
    color: Color.main,
  },
  button: {
    backgroundColor: Color.main,
    borderRadius: scale(100),
    padding: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: scale(16),
    fontFamily: Fonts.semibold,
    color: Color.white,
    textAlign: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(20),
    justifyContent: 'space-between',
  },
});
