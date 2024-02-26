import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
const SplashScreen = ({navigation}) => {
  useEffect(() => {
    // Simulate a delay, e.g., fetching data or performing initialization
    const splashTimer = setTimeout(() => {
      // Navigate to the main screen or any other screen after the delay
      navigation.replace('LoginScreen'); // Replace with your actual main screen name
    }, 3000); // Adjust the delay as needed

    // Clear the timer when the component unmounts
    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={IMAGES.Logo} style={styles.logo} />
      <Image source={IMAGES.LogoText} style={styles.logoText} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.main,
  },
  logo: {
    width: scale(120),
    height: scale(100),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  logoText: {
    width: scale(170),
    height: scale(80),
    resizeMode: 'contain',
    tintColor: Color.background,
  },
});
