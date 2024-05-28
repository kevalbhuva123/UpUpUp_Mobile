import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';

const ReferEarnScreen = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Refer & Earn'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Image source={IMAGES.Refer} style={styles.icon} />
        <Text style={styles.title}>Not yet started referring?</Text>
        <TouchableOpacity style={styles.referBtn}>
          <Text style={styles.btnTxt}>Refer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReferEarnScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: scale(100),
    width: scale(100),
    resizeMode: 'contain',
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(16),
    marginTop: scale(30),
  },
  referBtn: {
    padding: scale(10),
    width: '50%',
    borderRadius: scale(10),
    backgroundColor: Color.icon,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(40),
  },
  btnTxt: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(16),
    letterSpacing: 0.5,
  },
});
