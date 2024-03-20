import {Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {scale} from '../../utlis/Scale';
import Color from '../../Constants/Color';
import Fonts from '../../Constants/Fonts';

const ConfirmationModal = ({isVisible, asVendor, asUser, onClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Want to Login as ?</Text>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.loginBtn} onPress={asUser}>
              <Text style={styles.btnText}>User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={asVendor}>
              <Text style={styles.btnText}>Vendor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginTop: scale(40),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    letterSpacing: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.modalBG,
  },
  modalView: {
    width: '90%',
    backgroundColor: Color.white,
    borderRadius: scale(10),
    padding: scale(20),
    alignItems: 'center',
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
  },
  title: {
    fontSize: scale(18),
    fontFamily: Fonts.bold,
    color: Color.black,
  },
});
