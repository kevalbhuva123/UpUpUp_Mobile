import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../Constants/Fonts';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91 9924-685-972');

  const sendVerificationCode = async () => {
    console.log(':::::Pressed::::::');
    navigation.navigate('OTPverifyScreen');
    // try {
    //   const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    //   setVerificationId(confirmation.verificationId);
    //   console.log('>>>>>>>>', confirmation);
    //   // navigation.navigate('OTPverifyScreen',{id: confirmation.verificationId});
    // } catch (error) {
    //   console.log(error);
    //   Alert.alert('Error', 'Failed to send verification code');
    // }
  };
  return (
    <View style={styles.main}>
      <View style={styles.head}>
        <Image source={IMAGES.Logo} style={styles.logo} />
        <Image source={IMAGES.LogoText} style={styles.logoText} />
      </View>
      <View style={styles.innerView}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}>
          <Text style={styles.welcome}>WELCOME TO</Text>
          <Text style={[styles.up, {color: Color.subBg}]}>
            UP
            <Text style={[styles.up, {color: Color.icon}]}>
              UP<Text style={[styles.up, {color: Color.main}]}>UP</Text>
            </Text>
          </Text>
          <View style={styles.dummy} />
          <View style={styles.phoneInpView}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={text => {
                setPhoneNumber(text);
              }}
              style={styles.phoneInput}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              // maxLength={10}
              placeholderTextColor={Color.lightGrey}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              sendVerificationCode();
            }}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>
          <Text style={styles.bottomText}>
            Don't have an account?{' '}
            <Text
              style={styles.createAcc}
              onPress={() => {
                navigation.navigate('SignUpScreen');
              }}>
              Create Account
            </Text>
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  head: {
    flex: 0.35,
    backgroundColor: Color.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: scale(20),
    borderBottomLeftRadius: scale(20),
  },

  innerView: {
    flex: 0.65,
    paddingHorizontal: scale(25),
    paddingVertical: scale(30),
    backgroundColor: Color.background,
  },
  container: {
    flexGrow: 1,
  },
  logo: {
    width: scale(50),
    height: scale(40),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  logoText: {
    width: scale(110),
    height: scale(50),
    resizeMode: 'contain',
    tintColor: Color.background,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginTop: scale(60),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    letterSpacing: 2,
  },
  welcome: {
    color: Color.black,
    fontSize: scale(18),
    fontFamily: Fonts.regular,
  },
  up: {
    color: Color.black,
    fontSize: scale(18),
    marginTop: scale(3),
    fontFamily: Fonts.bold,
  },
  dummy: {
    width: scale(45),
    backgroundColor: Color.main,
    height: scale(2),
    marginBottom: scale(50),
    marginTop: scale(5),
    borderRadius: scale(2),
  },
  phoneInpView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: Color.subBg,
    width: '100%',
  },
  countryCode: {
    color: Color.black,
    fontSize: scale(18),
    paddingRight: scale(20),
    fontFamily: Fonts.bold,
  },
  phoneInput: {
    color: Color.black,
    fontSize: scale(18),
    width: '100%',
    fontFamily: Fonts.bold,
  },
  bottomText: {
    color: Color.black,
    fontSize: scale(14),
    alignSelf: 'center',
    marginTop: scale(40),
    fontFamily: Fonts.regular,
  },
  createAcc: {
    color: Color.icon,
    fontSize: scale(16),
    textDecorationLine: 'underline',
    textDecorationColor: Color.icon,
    fontFamily: Fonts.regular,
  },
});
