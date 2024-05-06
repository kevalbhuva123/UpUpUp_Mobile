import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Fonts from '../../Constants/Fonts';
import ConfirmationModal from '../../Components/ConfirmationModal';
import {useRoute} from '@react-navigation/native';
import apiConfigs from '../../api/apiconfig';
import AlertModal from '../../Components/AlertModal/AlertModal';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import auth from '@react-native-firebase/auth';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
const OTPverifyScreen = ({navigation}) => {
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const textInputRef = React.createRef(null);
  const route = useRoute();
  const [UserId, setUserId] = useState(
    route.params?.UserId ? route.params?.UserId : '',
  );
  const [value, setValue] = useState('');
  const [warning, setWarning] = useState('');
  const [visible, setVisible] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [OTPVerifySuccessfull, setOTPVerifySuccessfull] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  const [props] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    if (route.params && route.params?.UserId) {
      setUserId(route.params?.UserId);
    }
    textInputRef.current?.focus();
    setValue('');
  }, []);

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const onVerifyPressed = async () => {
    if (!value.trim()) {
      setWarning('Please enter the OTP.');
      WarningMessageTimer();
      return;
    } else if (value.trim().length !== 6) {
      setWarning('Please enter a valid 4-digit OTP.');
      WarningMessageTimer();
      return;
    }
    setLoader(true);
    // Send OTP verification request to backend
    console.log('>>>>', route.params?.data, '#########', value);
    try {
      const credential = auth.PhoneAuthProvider.credential(
        route.params?.data,
        value,
      );
      await auth().signInWithCredential(credential);
      console.log('Phone number verified successfully');
      try {
        let formData = new FormData();
        console.log('>>>>>>>>PHONE>>>', route?.params?.phoneNumber);
        formData.append('phone', route?.params?.phoneNumber);

        fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Vendor/index`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => response.json())
          .then(async data => {
            console.log('>>>>VENDOR DATA>>>>>', data);
            if (data == 'not exist') {
              setIsVendor(false);
            } else {
              await StorageService.saveItem(
                StorageService.STORAGE_KEYS.VENDOR_DETAILS,
                data[0],
              );
              setIsVendor(true);
            }
            setOTPVerifySuccessfull(true);
            setmodalVisible(true);
            setLoader(false);
          });
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setOTPVerifySuccessfull(false);
        setmodalVisible(true);
        setAlertMessage(error);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOTPVerifySuccessfull(false);
      setmodalVisible(true);
      setAlertMessage(error);
    }
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
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
          {Platform.OS == 'android' ? (
            <OTPInputView
              style={styles.OTPinput}
              pinCount={6}
              code={value}
              onCodeChanged={v => {
                setValue(v.replace(/[^0-9]/g, ''));
              }}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              textContentType="oneTimeCode"
              secureTextEntry
              autofillFromClipboard={false}
            />
          ) : (
            <CodeField
              ref={ref}
              secureTextEntry
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={6}
              autoFocus
              caretHidden={false}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <View key={index} style={styles.cellContainer}>
                  <TextInput
                    style={[
                      styles.cellInput,
                      isFocused && styles.focusCell,
                      symbol && styles.filledCell,
                      styles.Textinput,
                    ]}
                    ref={textInputRef}
                    value={symbol}
                    onChangeText={text => setValue(text, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textAlign="center">
                    {isFocused ? <Cursor /> : null}
                  </TextInput>
                </View>
              )}
            />
          )}
          {warning !== '' && <Text style={styles.warning}>{warning}</Text>}
          <TouchableOpacity
            onPress={() => {
              onVerifyPressed();
              // setVisible(true);
              //confirmCode();
            }}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>VERIFY OTP</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
      <ActivityLoader loading={Loader} />
      <AlertModal
        modalVisible={modalVisible}
        onClose={async () => {
          setmodalVisible(false);
          if (OTPVerifySuccessfull == true && isVendor == true) {
            let userDetails = await StorageService.getItem(
              StorageService.STORAGE_KEYS.USER_DETAILS,
            );
            if (userDetails?.id) {
              setVisible(true);
            } else {
              StorageService.saveItem(
                StorageService.STORAGE_KEYS.USER_TYPE,
                'VENDOR',
              );

              navigation.navigate('VendorHomeScreen');
            }
          } else if (OTPVerifySuccessfull == true) {
            let userDetails = await StorageService.getItem(
              StorageService.STORAGE_KEYS.USER_DETAILS,
            );

            console.log('>>>>>>', userDetails);
            if (userDetails?.id) {
              StorageService.saveItem(
                StorageService.STORAGE_KEYS.USER_TYPE,
                'USER',
              );
              navigation.navigate('HomeScreen');
            } else {
              navigation.navigate('MyProfileEdit', {
                data: route?.params?.phoneNumber,
              });
            }
            // StorageService.saveItem(
            //   StorageService.STORAGE_KEYS.USER_TYPE,
            //   'USER',
            // );
            // navigation.navigate('HomeScreen');
          }
        }}
        content={
          OTPVerifySuccessfull == true
            ? 'OTP verification successful.'
            : 'Entered OTP is either incorrect or expired , Please try again'
        }
      />
      <ConfirmationModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        asUser={async () => {
          setVisible(false);
          let userDetails = await StorageService.getItem(
            StorageService.STORAGE_KEYS.USER_DETAILS,
          );

          console.log('>>>>>>', userDetails);
          if (userDetails?.id) {
            StorageService.saveItem(
              StorageService.STORAGE_KEYS.USER_TYPE,
              'USER',
            );
            navigation.navigate('HomeScreen');
          } else {
            navigation.navigate('MyProfileEdit', {
              data: route?.params?.phoneNumber,
            });
          }
        }}
        asVendor={() => {
          setVisible(false);
          StorageService.saveItem(
            StorageService.STORAGE_KEYS.USER_TYPE,
            'VENDOR',
          );

          navigation.navigate('VendorHomeScreen');
        }}
      />
    </View>
  );
};

export default OTPverifyScreen;

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
    fontFamily: Fonts.regular,
  },
  OTPinput: {
    width: '90%',
    height: scale(60),
    color: Color.black,
    alignSelf: 'center',
  },
  underlineStyleBase: {
    width: scale(35),
    height: scale(35),
    borderWidth: scale(0),
    color: Color.black,
    borderWidth: scale(1),
    borderRadius: scale(8),
    borderColor: Color.lightGrey,
    marginHorizontal: scale(4),
  },
  underlineStyleHighLighted: {
    borderColor: Color.subBg,
    borderWidth: scale(2),
    borderRadius: scale(8),
  },
  codeFieldRoot: {marginTop: 20},
  focusCell: {
    borderColor: Color.subBg,
    borderWidth: scale(2),
  },
  cellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(5), // Adjust the spacing between cells
  },
  cellInput: {
    borderWidth: scale(1),
    borderColor: Color.lightGrey,
    lineHeight: scale(16),
    borderRadius: scale(10),
    width: scale(45), // Adjust the width of each cell
    height: scale(45), // Adjust the height of each cell
    fontSize: scale(4),
    fontFamily: Fonts.bold,
  },
  filledCell: {},
  Textinput: {
    color: Color.black,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
  },
});
