import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import IMAGES from '../../Assets/Icons/index';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';

const UPcoinScreen = ({navigation}) => {
  const [Loader, setLoader] = useState(false);
  const [upCoinData, setUpCoinData] = useState();
  useEffect(() => {
    getCoinDetail();
  }, []);

  const getCoinDetail = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Upcoin/up_coin_settings`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);

          setUpCoinData(result?.data);
          console.log(result);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.error('Error fetching venues:', error);
      setLoader(false);
    }
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'UPcoins'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View style={styles.coinView}>
          <View>
            <Text style={styles.title}>Balance</Text>
            <Text style={styles.coinCount}>
              {upCoinData?.total} <Text style={styles.subTitle}>Coins</Text>
            </Text>
            <Text style={styles.infoTxt}>
              Rs. {upCoinData?.conversion_rupee} = {upCoinData?.conversion_coin}{' '}
              Coin
            </Text>
          </View>
          <Image source={IMAGES.Wallet} style={styles.walletIcon} />
        </View>
        <View style={styles.master}>
          <Text style={styles.accText}>Account</Text>
          <View style={styles.container}>
            <Image source={IMAGES.Coin} style={styles.subIcon} />
            <Text style={styles.accSecText}>Purchased UPcoins</Text>
            <Text style={{paddingLeft: scale(60)}}>{upCoinData?.up_coin}</Text>
          </View>
          <View style={styles.container}>
            <Image source={IMAGES.Bonus} style={styles.subIcon} />
            <Text style={styles.accSecText}>Bonus UPcoins</Text>
            <Text style={{paddingLeft: scale(90)}}>
              {upCoinData?.bonus_coin}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default UPcoinScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  coinView: {
    width: '100%',
    height: scale(180),
    backgroundColor: Color.main,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(20),
  },
  walletIcon: {
    height: scale(100),
    width: scale(100),
    resizeMode: 'contain',
  },
  title: {fontFamily: Fonts.semibold, color: Color.white, fontSize: scale(24)},
  infoTxt: {
    fontFamily: Fonts.regular,
    color: Color.white,
    fontSize: scale(12),
    marginTop: scale(15),
  },
  coinCount: {fontFamily: Fonts.bold, color: Color.white, fontSize: scale(38)},
  subTitle: {
    fontFamily: Fonts.regular,
    color: Color.white,
    fontSize: scale(24),
  },
  subIcon: {
    height: scale(18),
    width: scale(18),
    resizeMode: 'contain',
    tintColor: Color.grey,
    marginTop: scale(1),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(5),
  },
  accSecText: {
    fontFamily: Fonts.regular,
    fontSize: scale(14),
    color: Color.grey,
    paddingLeft: scale(10),
  },
  accText: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(16),
    paddingBottom: scale(10),
  },
});
