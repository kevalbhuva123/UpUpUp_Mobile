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
import {Dropdown} from 'react-native-element-dropdown';
import {ownerVenues} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import {ActivityLoader} from '../../Components/Loader/Loader';
import AlertModal from '../../Components/AlertModal';

const AboutApp = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'About App'}
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
          <Text style={styles.text}>
            {`Welcome to UpSports, your ultimate solution for booking sports venues with ease! Whether you're organizing a casual game with friends or planning a tournament, UpSports connects you with top venues in your area, allowing you to find the perfect place for your event.

For players: Discover and book sports facilities at your convenience. From football fields to tennis courts, we offer a wide range of options to suit your needs. Simply browse, check availability, and make your reservation in just a few clicks.

For venue owners: List your venue on UpSports and reach a wider audience. Easily manage bookings, set your schedule, and attract more customers with our intuitive platform.

With UpSports, finding and booking the right venue has never been easier. Join our growing community of sports enthusiasts and venue owners today!

`}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AboutApp;

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
  text: {
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    color: Color.main,
  },
});
