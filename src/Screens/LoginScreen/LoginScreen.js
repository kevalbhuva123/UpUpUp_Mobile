import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert
} from 'react-native';
import React, {useState , useNavigation} from 'react';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../Constants/Fonts';
import COLORS from '../../Constants/Color'
import auth from '@react-native-firebase/auth';
import StorageService from "../../utlis/StorageService";
import Request from "../../api/Request";

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [uderID, setuderID] = useState('');
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);
  const [warning, setWarning] = useState("");

  const sendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      setWarning("Please enter your mobile number.");
      return;
    }
  
    if (!isValidPhoneNumber(phoneNumber)) {
      setInvalidPhoneNumber(true);
      return;
    }
  
    setInvalidPhoneNumber(false);
    try {
      const mobileNumber=phoneNumber
      const params = {
        phoneNumber: mobileNumber,
      };
      const response = await Request.post("Login/index", params);
      console.log('1-->',response.data)
      
      if (response) {
        Alert.alert("OTP Sent", "An OTP has been sent to your mobile number.")
        navigation.navigate('OTPverifyScreen',{phoneNumber:phoneNumber});
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send OTP. Please try again later.");
    }
  };

  const isValidPhoneNumber = (number) => {
    // Implement your validation logic here
    // For simplicity, let's assume valid if the number starts with '+91' and has 10 digits
    return /^(\+91\s?)?[0-9]{10}$/.test(number);
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
              onChangeText={(text) => {
                setPhoneNumber(text);
                setInvalidPhoneNumber(false);
              }}
              style={styles.phoneInput}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              // maxLength={10}
              placeholderTextColor={Color.lightGrey}
            />
          </View>
          {warning !== "" && <Text style={styles.warning}>{warning}</Text>}
          {invalidPhoneNumber && (
            <Text style={styles.errorText}>Please enter a valid phone number.</Text>
          )}
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
  errorText: {
    marginTop:scale(5),
    fontFamily: Fonts.regular_400,
    color: COLORS.red,
    fontSize: scale(14),
    textAlign: "center",
  },
  warning: {
    color: COLORS.red,
    textAlign: "center",
    fontSize: scale(14),
  }
});
