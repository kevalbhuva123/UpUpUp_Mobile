import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Platform,
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

const OTPverifyScreen = ({navigation}) => {
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const textInputRef = React.createRef(null);
  const [value, setValue] = useState('');

  const [props] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    textInputRef.current?.focus();
    setValue('');
  }, []);

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
          {Platform.OS == 'android' ? (
            <OTPInputView
              style={styles.OTPinput}
              pinCount={4}
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
              cellCount={4}
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>VERIFY OTP</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
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
    width: scale(45),
    height: scale(45),
    borderWidth: scale(0),
    color: Color.black,
    borderWidth: scale(1),
    borderRadius: scale(8),
    borderColor: Color.lightGrey,
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
});
