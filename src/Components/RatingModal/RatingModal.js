import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {Rating} from 'react-native-ratings'; // Assuming you have a Rating component library installed
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';

const RatingModal = ({
  isVisible,
  rating,
  setRating,
  onClose,
  handleRatingSubmit,
  buttonText,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Help us to find the right match,{'\n'} rate their skills.
          </Text>
          <Rating
            // showRating
            onFinishRating={setRating}
            startingValue={rating}
            imageSize={scale(30)}
            ratingColor={Color.main}
            ratingBackgroundColor={Color.main}
            style={{marginTop: scale(20)}}
          />
          <TouchableOpacity
            onPress={handleRatingSubmit}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: scale(15),
    textAlign: 'center',
    fontSize: scale(16),
    fontFamily: Fonts.bold,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginTop: scale(50),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
  },
});

export default RatingModal;
