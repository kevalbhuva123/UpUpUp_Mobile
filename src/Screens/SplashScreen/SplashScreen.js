import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import StorageService from '../../utlis/StorageService';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      userDetails();
    }, 3000); // Adjust the delay as needed

    // Clear the timer when the component unmounts
    return () => clearTimeout(splashTimer);
  }, []);

  const userDetails = async () => {
    let userType = await StorageService.getItem(
      StorageService.STORAGE_KEYS.USER_TYPE,
    );
    if (userType == 'VENDOR') {
      navigation.replace('VendorHomeScreen');
    } else if (userType == 'USER') {
      navigation.replace('HomeScreen');
    } else {
      navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGES.Splash} style={styles.background}>
        <Image source={IMAGES.LogoText} style={styles.logoText} />
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  logo: {
    width: scale(120),
    height: scale(100),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  logoText: {
    width: scale(250),
    height: scale(130),
    resizeMode: 'contain',
  },
});
