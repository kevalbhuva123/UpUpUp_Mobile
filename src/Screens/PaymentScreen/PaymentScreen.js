import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';
import {ActivityLoader} from '../../Components/Loader/Loader';
import moment from 'moment';

const PaymentScreen = ({navigation, route}) => {
  const [details, setDetails] = useState(route?.params);
  const [upCoin, setUpCoin] = useState();
  const [serviceCharges, setServiceCharges] = useState();
  const [Loader, setLoader] = useState(false);
  const [ownerDetail, setOwnerDetail] = useState();
  const [isUPcoinSelected, setIsUPcoinSelected] = useState(false);

  useEffect(() => {
    getUserCoinInfo();
  }, []);

  const getUserCoinInfo = async () => {
    console.log('>>>>>>');
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      setOwnerDetail(userData);
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('location_id', userData?.location);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Upcoin/up_coin`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          setUpCoin(result?.data);

          const formdata = new FormData();
          formdata.append('location_id', userData?.location);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Callbook/service_charge`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              setLoader(false);
              setServiceCharges(result?.data?.amount);
              console.log(result);
            })
            .catch(error => {
              setLoader(false);

              console.error(error);
            });
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Payment Summary'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View style={styles.master}>
          <View style={styles.upperView}>
            <View style={styles.lineView}>
              <Text style={styles.title}>Venue Name :</Text>
              <Text style={styles.value}>{details?.venueData?.venue}</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Booked By :</Text>
              <Text style={styles.value}>{ownerDetail?.name}</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Playing Date :</Text>
              <Text style={styles.value}>
                {moment(details?.selectedDate).format('DD-MM-YYYY')}
              </Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Sub Total :</Text>
              <Text style={styles.value}>Rs. {details?.subTotal}</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Service Charge :</Text>
              <Text style={styles.value}>Rs. {serviceCharges}</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Total Amount :</Text>
              <Text style={styles.value}>
                Rs. {details?.subTotal + serviceCharges}
              </Text>
            </View>
          </View>
          <View style={styles.lowerView}>
            <View style={styles.subView}>
              <Text style={styles.heading}>Pay thorough :</Text>
              <View style={styles.rawView}>
                <Image source={IMAGES.BookVenue} style={styles.icon} />
                <Text style={[styles.subText, {width: '60%'}]}>UPcoins</Text>
                <Text style={styles.coinText}> </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsUPcoinSelected(!isUPcoinSelected);
                  }}>
                  <Image
                    style={
                      isUPcoinSelected
                        ? styles.checkedIcon
                        : styles.unCheckedIcon
                    }
                  />
                </TouchableOpacity>
              </View>
              <View View style={styles.rawView}>
                <Image style={styles.icon} />

                <Text style={[styles.subText, {width: '60%'}]}>
                  Balance UPcoins
                </Text>
                <Text style={styles.coinText}>
                  {parseInt(upCoin?.bonus_coins) +
                    parseInt(upCoin?.purchased_coins)}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setIsUPcoinSelected(!isUPcoinSelected);
                  }}>
                  <Image
                    source={
                      isUPcoinSelected ? IMAGES.Checked : IMAGES.Unchecked
                    }
                    style={
                      isUPcoinSelected
                        ? styles.checkedIcon
                        : styles.unCheckedIcon
                    }
                  />
                </TouchableOpacity>
              </View>
              {isUPcoinSelected && (
                <View View style={styles.rawView}>
                  <Image style={styles.icon} />

                  <Text style={[styles.subText, {width: '60%'}]}></Text>
                  <Text style={[styles.coinText, {color: Color.green}]}>
                    -{' '}
                    {parseInt(upCoin?.bonus_coins) +
                      parseInt(upCoin?.purchased_coins)}{' '}
                    Rs.
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setIsUPcoinSelected(!isUPcoinSelected);
                    }}>
                    <Image
                      style={
                        isUPcoinSelected
                          ? styles.checkedIcon
                          : styles.unCheckedIcon
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.subView}>
              <Text style={styles.heading}>Online :</Text>
              <View style={styles.rawView}>
                <Image source={IMAGES.Card} style={styles.icon} />
                <Text style={[styles.subText, {width: '60%'}]}>
                  Remaining Payment
                </Text>
                <Text style={styles.coinText}>
                  Rs.{' '}
                  {isUPcoinSelected
                    ? details?.subTotal +
                      serviceCharges -
                      (parseInt(upCoin?.bonus_coins) +
                        parseInt(upCoin?.purchased_coins))
                    : details?.subTotal + serviceCharges}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity style={styles.bottomButton} onPress={() => {}}>
        <Text style={styles.buttonText}>PROCEED</Text>
      </TouchableOpacity>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  upperView: {
    backgroundColor: Color.main,
    padding: scale(20),
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: scale(14),
    color: Color.white,
    width: '40%',
  },
  value: {
    fontFamily: Fonts.regular,
    fontSize: scale(14),
    color: Color.white,
    width: '60%',
  },
  lineView: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: scale(15),
  },
  bottomButton: {
    backgroundColor: Color.icon,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(15),
  },
  buttonText: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(14),
  },
  lowerView: {
    padding: scale(20),
  },
  heading: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(5),
  },
  subText: {fontFamily: Fonts.regular, fontSize: scale(14), color: Color.black},
  subView: {
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
    padding: scale(10),
    marginBottom: scale(15),
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.subBg,
    marginTop: scale(3),
  },
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
    marginTop: scale(3),
  },
  icon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    marginRight: scale(10),
  },
  rawView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  coinText: {
    marginRight: scale(15),
    fontFamily: Fonts.semibold,
    color: Color.black,
    fontSize: scale(14),
  },
});
