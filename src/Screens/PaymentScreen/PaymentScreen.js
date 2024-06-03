import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

const PaymentScreen = ({navigation, route}) => {
  const [details, setDetails] = useState();
  const [upCoin, setUpCoin] = useState();
  const [serviceCharges, setServiceCharges] = useState();
  const [Loader, setLoader] = useState(false);

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
            .then(response => response.text())
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
              <Text style={styles.value}>cajnj ncanskjc kjnckjnsa lknk </Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Booked By :</Text>
              <Text style={styles.value}>Rexon Antony</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Playing Date :</Text>
              <Text style={styles.value}>Rexon Antony</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Sub Total :</Text>
              <Text style={styles.value}>Rexon Antony</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Service Charge :</Text>
              <Text style={styles.value}>{serviceCharges}</Text>
            </View>
            <View style={styles.lineView}>
              <Text style={styles.title}>Total Amount :</Text>
              <Text style={styles.value}></Text>
            </View>
          </View>
          <View style={styles.lowerView}></View>
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
});
