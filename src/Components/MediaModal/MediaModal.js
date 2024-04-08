import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';

const MediaModal = props => {
  const {modalVisible, onCancel, onCamera, onGallery, onFile} = props;
  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <View style={styles.root}>
        <View style={styles.main}>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.buttonSubView}
              onPress={() => {
                onCamera();
              }}>
              <View style={styles.iconView}>
                <Image source={IMAGES.Cam} style={styles.icon} />
              </View>
              <Text style={styles.headingText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSubView}
              onPress={() => {
                onGallery();
              }}>
              <View style={styles.iconView}>
                <Image source={IMAGES.Gallery} style={styles.icon} />
              </View>
              <Text style={styles.headingText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onCancel();
            }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MediaModal;

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
    paddingTop: scale(30),
  },
  headingText: {
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    color: Color.black,
    textAlign: 'center',
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
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonSubView: {
    alignItems: 'center',
  },
  icon: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  iconView: {
    backgroundColor: Color.lightGrey,
    padding: scale(15),
    borderRadius: scale(10),
    marginBottom: scale(10),
  },
});
