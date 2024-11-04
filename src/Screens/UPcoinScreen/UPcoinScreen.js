import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import RBSheet from 'react-native-raw-bottom-sheet';
import {paymentOptions} from '../../Constants/StaticData';

const UPcoinScreen = ({navigation}) => {
  const refRBSheetCoin = useRef();

  const [Loader, setLoader] = useState(false);
  const [upCoinData, setUpCoinData] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [selectedOption, setSelectedOption] = useState({});
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
      description: 'UpSports buy UPcoins',
      image: IMAGES.LogoText,
      currency: 'INR',
      key: 'rzp_test_4FcySxlJrgjMv2',
      amount: selectedOption?.price * 100,
      name: 'UpSports',
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
        setLoader(true);
        const formdata = new FormData();
        formdata.append('user_id', userData?.id);
        formdata.append('buycoin_id', paymentData.razorpay_payment_id);
        formdata.append('location_id', userData?.location);
        formdata.append('payment_id', paymentData.razorpay_payment_id);
        formdata.append('rupee', selectedOption?.price);
        formdata.append('coin', selectedOption?.coin);

        const requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };

        fetch(
          `${apiConfigs.LOCAL_SERVER_API_URL}/Upcoin/buy_coin_payment`,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setLoader(false);
            setAlertMsg('UPcoins added Successfully.');
            setAlertVisible(true);
            console.log(result);
          })
          .catch(error => {
            setLoader(false), console.error(error);
          });
      })
      .catch(error => {
        // handle failure
        console.log(`Error:`, error.code, error.description);
      });
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  const renderOptions = ({item}) => {
    let isSelected = selectedOption?.id == item?.id;
    return (
      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => {
          setSelectedOption(item);
        }}>
        <Image
          source={isSelected ? IMAGES.CheckedRadio : IMAGES.UncheckedRadio}
          style={isSelected ? styles.radioIcon : styles.unCheckedRadio}
        />
        <Text style={styles.optionCardText}>
          Rs.{item?.price} = {item?.coin} Coin
        </Text>
      </TouchableOpacity>
    );
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
            // buyUPcoins();
            refRBSheetCoin?.current?.open();
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
      <RBSheet
        ref={refRBSheetCoin}
        useNativeDriver={false}
        closeOnPressMask
        customStyles={{
          container: {
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
            backgroundColor: Color.white,
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          draggableIcon: {
            backgroundColor: Color.main,
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
        height={scale(400)}
        draggable>
        <View style={{paddingTop: scale(10)}}>
          <Text style={[styles.rbTitle, {paddingHorizontal: scale(20)}]}>
            Select Option
          </Text>
          <FlatList
            data={paymentOptions}
            renderItem={renderOptions}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={{
              backgroundColor: Color.white,
              width: '100%',
              paddingHorizontal: scale(20),
              paddingTop: scale(5),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              buyUPcoins();
              refRBSheetCoin?.current?.close();
            }}
            disabled={selectedOption?.id ? false : true}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>PROCEED</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
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
  optionCard: {
    width: '100%',
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(2),

    elevation: 6,
    borderRadius: scale(10),
    padding: scale(20),
    marginBottom: scale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCardText: {
    fontFamily: Fonts.bold,
    fontSize: scale(16),
    color: Color.black,
    paddingLeft: scale(10),
  },
  radioIcon: {
    height: scale(20),
    width: scale(20),
    tintColor: Color.icon,
    resizeMode: 'contain',
  },
  unCheckedRadio: {
    height: scale(20),
    width: scale(20),
    tintColor: Color.lightGrey,
    resizeMode: 'contain',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: scale(150),
    height: scale(150),
    resizeMode: 'contain',
    marginTop: scale(50),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
    marginBottom: scale(20),
  },
  rbTitle: {
    fontFamily: Fonts.bold,
    fontSize: scale(18),
    color: Color.black,
    paddingBottom: scale(20),
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
