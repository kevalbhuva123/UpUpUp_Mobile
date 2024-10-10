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

const AboutUs = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'About Us'}
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
            {`UpSmart Solutions is a leading provider of advanced technological solutions, specializing in product and platform engineering, big data and analytics, Cyber Security, application designing,  mobile development, artificial intelligence/machine learning, and remote technical support services. We have built a strong reputation for delivering innovative and high-quality solutions to clients across various industries who are looking to digitally transform their businesses or enhance their existing digital strategies.

With our comprehensive suite of services and deep industry knowledge, we are able to provide customized solutions that address the unique challenges faced by each client. From startups to enterprise-level organizations, we work closely with our clients to understand their goals and develop tailored strategies that meet their specific needs.

Our team of experienced professionals is dedicated to helping businesses harness the power of technology to drive growth and improve efficiency. Whether it’s developing cutting-edge software applications, analyzing large volumes of data to extract valuable insights, or designing user-friendly interfaces, UpSmart Solutions is committed to delivering exceptional results that exceed our clients’ expectations.`}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AboutUs;

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
