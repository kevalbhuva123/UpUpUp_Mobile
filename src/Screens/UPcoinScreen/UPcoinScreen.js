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
import RazorpayCheckout from 'react-native-razorpay';
import AlertModal from '../../Components/AlertModal';

const UPcoinScreen = ({navigation}) => {
  const [Loader, setLoader] = useState(false);
  const [upCoinData, setUpCoinData] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

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

  const buyUPcoins = async () => {
    const userData = await StorageService.getItem(
      StorageService.STORAGE_KEYS.USER_DETAILS,
    );
    console.log('CALLED', userData);

    var options = {
      description: 'UPUPUP buy UPcoins',
      image: IMAGES.LogoText,
      currency: 'INR',
      key: 'rzp_test_aB42rLcq2jUrJ6',
      amount: 500 * 100,
      name: 'UPUPUP',
      // order_id: '', //Replace this with an order_id created using Orders API.
      prefill: {
        email: userData?.email,
        contact: userData?.phone_no,
        name: userData?.name,
      },
      theme: {color: Color.main},
    };
    RazorpayCheckout.open(options)
      .then(paymentData => {
        // handle success
        console.log(`Success:`, paymentData.razorpay_payment_id);
        if (paymentData?.razorpay_payment_id) {
          setAlertMsg('UPcoins added Successfully.');
          setAlertVisible(true);
        }
      })
      .catch(error => {
        // handle failure
        console.log(`Error:`, error.code, error.description);
      });
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'UPcoins'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: Color.background}}
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
            <Text style={[styles.accSecText, {paddingLeft: scale(60)}]}>
              {upCoinData?.up_coin}
            </Text>
          </View>
          <View style={styles.container}>
            <Image source={IMAGES.Bonus} style={styles.subIcon} />
            <Text style={styles.accSecText}>Bonus UPcoins</Text>
            <Text style={[styles.accSecText, {paddingLeft: scale(90)}]}>
              {upCoinData?.bonus_coin}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            buyUPcoins();
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>BUY UPcoins</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <ActivityLoader loading={Loader} />
      <AlertModal
        modalVisible={alertVisible}
        onClose={async () => {
          setAlertVisible(false);
          getCoinDetail();
        }}
        content={alertMsg}
      />
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
  loginBtn: {
    backgroundColor: Color.icon,
    width: '90%',
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
