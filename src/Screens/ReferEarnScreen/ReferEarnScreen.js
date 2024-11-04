import {
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';

const ReferEarnScreen = ({navigation}) => {
  const [Loader, setLoader] = useState(false);

  const refer = async () => {
    try {
      setLoader(true);

      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('location_id', userData?.location);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Referfriend/refer_friend`,
        requestOptions,
      )
        .then(response => response.json())
        .then(async result => {
          setLoader(false);
          await Share.share({
            title: `UpSports App- Let's play together`,
            message: `Here is my referral code : ${result?.data?.referal_id}. Please use this at a time of login.`,
            url: 'https://www.google.co.in/',
          });
          console.log(result);
        })
        .catch(error => {
          setLoader(false), console.error(error);
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
        heading={'Refer & Earn'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Image source={IMAGES.Refers} style={styles.icon} />
        <Text style={styles.title}>Not yet started referring?</Text>
        <TouchableOpacity
          style={styles.referBtn}
          onPress={() => {
            refer();
          }}>
          <Text style={styles.btnTxt}>Refer</Text>
        </TouchableOpacity>
      </View>
      <ActivityLoader loading={Loader} />
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
