import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import Fonts from '../../Constants/Fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';
import {ActivityLoader} from '../../Components/Loader/Loader';
import AlertModal from '../../Components/AlertModal';

const FeedBackScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const [Loader, setLoader] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const submitFeedback = async () => {
    try {
      setLoader(true);

      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('feedback', value);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Feedback/index`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          if (result?.ErrorCode == 0) {
            setAlertMsg('Feedback added Successfully.');
            setAlertVisible(true);
          }
          console.log(result);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Feedback'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.master}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View>
          <View style={styles.heading}>
            <Image source={IMAGES.LogoText} style={styles.logo} />
          </View>
          <Text style={styles.headingText}>
            Your feedback helps us to understand,{'\n'}what we do well and where
            we can improve.
          </Text>
          <TextInput
            value={value}
            onChangeText={text => {
              setValue(text);
            }}
            multiline
            style={styles.input}
            placeholder={'Please enter your feedback here.'}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            submitFeedback();
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>SEND FEEDBACK</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <ActivityLoader loading={Loader} />
      <AlertModal
        modalVisible={alertVisible}
        onClose={async () => {
          setAlertVisible(false);
          navigation.goBack();
        }}
        content={alertMsg}
      />
    </View>
  );
};

export default FeedBackScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    justifyContent: 'space-between',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  headingText: {
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  logo: {
    height: scale(60),
    width: scale(90),
    resizeMode: 'contain',
    // tintColor: Color.icon,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    letterSpacing: 1,
  },
  input: {
    color: Color.black,
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    height: scale(200),
    borderRadius: 10,
    backgroundColor: Color.white,
    textAlignVertical: 'top',
    padding: scale(10),
    elevation: 6,
    marginTop: scale(15),
  },
});
