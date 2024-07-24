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
import RazorpayCheckout from 'react-native-razorpay';

const PaymentScreen = ({navigation, route}) => {
  const [details, setDetails] = useState(route?.params);
  const [upCoin, setUpCoin] = useState();
  const [serviceCharges, setServiceCharges] = useState();
  const [Loader, setLoader] = useState(false);
  const [ownerDetail, setOwnerDetail] = useState();
  const [isUPcoinSelected, setIsUPcoinSelected] = useState(false);

  useEffect(() => {
    getUserCoinInfo();
    console.log('>>>>>>>>', route?.params);
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
              setServiceCharges(result?.data);
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

  const upiPayment = async () => {
    const userData = await StorageService.getItem(
      StorageService.STORAGE_KEYS.USER_DETAILS,
    );
    console.log('CALLED', userData);

    setLoader(true);

    if (
      isUPcoinSelected &&
      parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins) >=
        details?.subTotal + serviceCharges?.amount
    ) {
      const coPlayersIDs = details?.selectedCoPlayer.map(item => item.id);
      const contactList = details?.selectedCoPlayerFromContact.map(contact => ({
        contact_name: contact.name,
        contact_number: contact.phone_no,
      }));

      const paymentMode = !isUPcoinSelected
        ? 1
        : isUPcoinSelected &&
          parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins) >=
            details?.subTotal + serviceCharges?.amount
        ? 2
        : 3;

      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('sports_id', details?.selectedSport[0]);
      formdata.append(
        'date',
        moment(details?.selectedDate).format('YYYY-MM-DD'),
      );
      formdata.append('court_id', details?.selectedCourt[0]);
      formdata.append('venue_id', details?.venueData?.id);
      formdata.append('co_players', coPlayersIDs);
      formdata.append('co_players_contact', contactList);
      formdata.append('court_time', details?.slotTime);
      formdata.append('capacity', coPlayersIDs?.length);
      formdata.append('coupon_id', details?.selectedCoupon);
      formdata.append('offer', 0);
      formdata.append(
        'price',
        isUPcoinSelected
          ? parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins) >=
            details?.subTotal + serviceCharges?.amount
            ? 0
            : details?.subTotal +
              serviceCharges?.amount -
              (parseInt(upCoin?.bonus_coins) +
                parseInt(upCoin?.purchased_coins))
          : details?.subTotal + serviceCharges?.amount,
      );
      formdata.append('cost', details?.actualAmount);
      formdata.append(
        'balance',
        isUPcoinSelected
          ? parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins) >=
            details?.subTotal + serviceCharges?.amount
            ? 0
            : details?.subTotal +
              serviceCharges?.amount -
              (parseInt(upCoin?.bonus_coins) +
                parseInt(upCoin?.purchased_coins))
          : details?.subTotal + serviceCharges?.amount,
      );
      formdata.append('mode', 1);
      formdata.append('offer_id', '[]');
      formdata.append('payment_mode', paymentMode);
      formdata.append('upcoin_setting_id', '1');
      formdata.append(
        'rupee',
        paymentMode == 1
          ? details?.subTotal + serviceCharges?.amount
          : paymentMode == 2
          ? 0
          : paymentMode == 3
          ? details?.subTotal +
            serviceCharges?.amount -
            (parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins))
          : 0,
      );
      formdata.append(
        'coin',
        isUPcoinSelected
          ? parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins) >=
            details?.subTotal + serviceCharges?.amount
            ? details?.subTotal + serviceCharges?.amount
            : parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins)
          : 0,
      );
      formdata.append('share_location', userData?.location);
      formdata.append('service_id', serviceCharges?.id);
      formdata.append('service_amount', serviceCharges?.amount);
      formdata.append('service_total', serviceCharges?.amount);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/booking_demo_test`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(
            '============================================================',
          );
          const formData = new FormData();
          formData.append('user_id', userData?.id);
          formData.append('booking_id', result?.Data);
          formData.append('transaction_id', result?.Data);
          formData.append('payment_id', '');
          formData.append('payment_mode', paymentMode);
          formData.append('coupon_id', details?.selectedCoupon);
          formData.append('court_id', details?.selectedCourt[0]);
          formData.append('court_time', details?.slotTime);
          formData.append(
            'date',
            moment(details?.selectedDate).format('YYYY-MM-DD'),
          );
          formData.append('share_location', userData?.location);
          formData.append('payment_type', paymentMode);
          formData.append('upcoin_setting_id', '1');
          formData.append(
            'rupee',
            paymentMode == 1
              ? details?.subTotal + serviceCharges?.amount
              : paymentMode == 2
              ? 0
              : paymentMode == 3
              ? details?.subTotal +
                serviceCharges?.amount -
                (parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins))
              : 0,
          );
          formdata.append(
            'coin',
            isUPcoinSelected
              ? parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins) >=
                details?.subTotal + serviceCharges?.amount
                ? details?.subTotal + serviceCharges?.amount
                : parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins)
              : 0,
          );

          const requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/booking_payment_demo`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              setLoader(false);
              console.log('>>>>>RRRRRR>>>>>', result);
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
    } else {
      var options = {
        description: 'UPUPUP venue booking',
        image: IMAGES.LogoText,
        currency: 'INR',
        key: 'rzp_test_aB42rLcq2jUrJ6',
        amount: isUPcoinSelected
          ? parseInt(upCoin?.bonus_coins) + parseInt(upCoin?.purchased_coins) >=
            details?.subTotal + serviceCharges?.amount
            ? 0
            : (details?.subTotal +
                serviceCharges?.amount -
                (parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins))) *
              100
          : (details?.subTotal + serviceCharges?.amount) * 100,
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

          const coPlayersIDs = details?.selectedCoPlayer.map(item => item.id);
          const contactList = details?.selectedCoPlayerFromContact.map(
            contact => ({
              contact_name: contact.name,
              contact_number: contact.phone_no,
            }),
          );

          const paymentMode = !isUPcoinSelected
            ? 1
            : isUPcoinSelected &&
              parseInt(upCoin?.bonus_coins) +
                parseInt(upCoin?.purchased_coins) >=
                details?.subTotal + serviceCharges?.amount
            ? 2
            : 3;

          const formdata = new FormData();
          formdata.append('user_id', userData?.id);
          formdata.append('sports_id', details?.selectedSport[0]);
          formdata.append(
            'date',
            moment(details?.selectedDate).format('YYYY-MM-DD'),
          );
          formdata.append('court_id', details?.selectedCourt[0]);
          formdata.append('venue_id', details?.venueData?.id);
          formdata.append('co_players', coPlayersIDs);
          formdata.append('co_players_contact', contactList);
          formdata.append('court_time', details?.slotTime);
          formdata.append('capacity', coPlayersIDs?.length);
          formdata.append('coupon_id', details?.selectedCoupon);
          formdata.append('offer', 0);
          formdata.append(
            'price',
            isUPcoinSelected
              ? parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins) >=
                details?.subTotal + serviceCharges?.amount
                ? 0
                : details?.subTotal +
                  serviceCharges?.amount -
                  (parseInt(upCoin?.bonus_coins) +
                    parseInt(upCoin?.purchased_coins))
              : details?.subTotal + serviceCharges?.amount,
          );
          formdata.append('cost', details?.actualAmount);
          formdata.append(
            'balance',
            isUPcoinSelected
              ? parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins) >=
                details?.subTotal + serviceCharges?.amount
                ? 0
                : details?.subTotal +
                  serviceCharges?.amount -
                  (parseInt(upCoin?.bonus_coins) +
                    parseInt(upCoin?.purchased_coins))
              : details?.subTotal + serviceCharges?.amount,
          );
          formdata.append('mode', 1);
          formdata.append('offer_id', '[]');
          formdata.append('payment_mode', paymentMode);
          formdata.append('upcoin_setting_id', '1');
          formdata.append(
            'rupee',
            paymentMode == 1
              ? details?.subTotal + serviceCharges?.amount
              : paymentMode == 2
              ? 0
              : paymentMode == 3
              ? details?.subTotal +
                serviceCharges?.amount -
                (parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins))
              : 0,
          );
          formdata.append(
            'coin',
            isUPcoinSelected
              ? parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins) >=
                details?.subTotal + serviceCharges?.amount
                ? details?.subTotal + serviceCharges?.amount
                : parseInt(upCoin?.bonus_coins) +
                  parseInt(upCoin?.purchased_coins)
              : 0,
          );
          formdata.append('share_location', userData?.location);
          formdata.append('service_id', serviceCharges?.id);
          formdata.append('service_amount', serviceCharges?.amount);
          formdata.append('service_total', serviceCharges?.amount);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/booking_demo_test`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              console.log(
                '============================================================',
                result,
              );

              const formdata = new FormData();
              formdata.append('user_id', userData?.id);
              formdata.append('booking_id', result?.Data);
              formdata.append('transaction_id', result?.Data);
              formdata.append('payment_id', paymentData.razorpay_payment_id);
              formdata.append('payment_mode', paymentMode);
              formdata.append('coupon_id', details?.selectedCoupon);
              formdata.append('court_id', details?.selectedCourt[0]);
              formdata.append('court_time', JSON.stringify(details?.slotTime));
              formdata.append(
                'date',
                moment(details?.selectedDate).format('YYYY-MM-DD'),
              );
              formdata.append('share_location', userData?.location);
              formdata.append('payment_type', paymentMode);
              formdata.append('upcoin_setting_id', '1');
              formdata.append(
                'rupee',
                paymentMode == 1
                  ? details?.subTotal + serviceCharges?.amount
                  : paymentMode == 2
                  ? 0
                  : paymentMode == 3
                  ? details?.subTotal +
                    serviceCharges?.amount -
                    (parseInt(upCoin?.bonus_coins) +
                      parseInt(upCoin?.purchased_coins))
                  : 0,
              );
              formdata.append(
                'coin',
                isUPcoinSelected
                  ? parseInt(upCoin?.bonus_coins) +
                      parseInt(upCoin?.purchased_coins) >=
                    details?.subTotal + serviceCharges?.amount
                    ? details?.subTotal + serviceCharges?.amount
                    : parseInt(upCoin?.bonus_coins) +
                      parseInt(upCoin?.purchased_coins)
                  : 0,
              );

              const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
              };

              console.log(
                '>>>>>>>>>>>>>><<><>><FD<F<D>F<D><F</D></D>',
                formdata,
              );

              fetch(
                `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/booking_payment_demo`,
                requestOptions,
              )
                .then(response => response.json())
                .then(result => {
                  setLoader(false);
                  console.log('>>>>>RRRRRR>>>>>', result);
                })
                .catch(error => {
                  setLoader(false);
                  console.log('>>>>>ERROR>>>>>', error);
                });
            })
            .catch(error => {
              setLoader(false);
              console.error(error);
            });
        })
        .catch(error => {
          // handle failure
          console.log(`Error:`, error.code, error.description);
          setLoader(false);
        });
    }
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Payment Summary'}
        onBackPress={() => navigation.navigate('BookVenueScreen')}
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
              <Text style={styles.value}>Rs. {serviceCharges?.amount}</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Total Amount :</Text>
              <Text style={styles.value}>
                Rs. {details?.subTotal + serviceCharges?.amount}
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
                      parseInt(upCoin?.purchased_coins) >=
                    details?.subTotal + serviceCharges?.amount
                      ? details?.subTotal + serviceCharges?.amount
                      : parseInt(upCoin?.bonus_coins) +
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
                    ? parseInt(upCoin?.bonus_coins) +
                        parseInt(upCoin?.purchased_coins) >=
                      details?.subTotal + serviceCharges?.amount
                      ? 0
                      : details?.subTotal +
                        serviceCharges?.amount -
                        (parseInt(upCoin?.bonus_coins) +
                          parseInt(upCoin?.purchased_coins))
                    : details?.subTotal + serviceCharges?.amount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => {
          upiPayment();
        }}>
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
