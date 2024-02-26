import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons';
import Fonts from '../../Constants/Fonts';

const CustomHeader = props => {
  const {heading, onBackPress} = props;
  return (
    <SafeAreaView style={styles.main}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          onBackPress();
        }}>
        <Image source={IMAGES.Back} style={styles.icon} />
      </TouchableOpacity>

      <Text style={[styles.text]}>{heading}</Text>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  main: {
    backgroundColor: Color.main,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: Platform.OS == 'ios' ? 44 : 0,
  },
  text: {
    color: Color.white,
    fontSize: scale(17),
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  dummyView: {
    height: scale(60),
    width: scale(60),
  },
  backButton: {
    height: scale(60),
    width: scale(50),
    justifyContent: 'center',
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
});
