import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import {ActivityLoader} from '../../Components/Loader/Loader';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const MatchDetailScreen = ({navigation, route}) => {
  const [Loader, setLoader] = useState(false);
  const [matchDetails, setMatchDetails] = useState();
  useEffect(() => {
    getMatchDetails();
  }, []);

  const getMatchDetails = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('match_id', route.params.id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/get_match_details`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setMatchDetails(result?.Data);
          console.log(result);
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
        heading={'Match Details'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View
          style={[
            styles.subView,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <Image
            source={{uri: matchDetails?.match[0]?.sports_image}}
            style={styles.sportIcon}
          />
          <View style={{width: '50%', paddingLeft: scale(10)}}>
            <Text style={styles.matchName}>
              {matchDetails?.match[0]?.match_name?.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.statusView,
                {
                  backgroundColor:
                    matchDetails?.status == 'Request'
                      ? Color.icon
                      : matchDetails?.status == 'Accept'
                      ? Color.green
                      : matchDetails?.status == 'Pending'
                      ? Color.yellow
                      : Color.main,
                  color: Color.white,
                },
              ]}>
              {matchDetails?.status}
            </Text>
          </View>
          <View style={styles.profileView}>
            <Image
              source={
                matchDetails?.match[0]?.user_image != ''
                  ? {uri: matchDetails?.match[0]?.user_image}
                  : IMAGES.Person
              }
              style={styles.profile}
            />
            <Text style={styles.name} numberOfLines={1}>
              {matchDetails?.match[0]?.hosted_by}
            </Text>
          </View>
        </View>
        <View style={[styles.subView]}>
          <View>
            <Image source={IMAGES.Location} style={styles.icon} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default MatchDetailScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: scale(20),
    backgroundColor: Color.background,
  },
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
  sportIcon: {
    height: scale(50),
    width: scale(50),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '50%',
    fontSize: scale(10),
    paddingVertical: scale(5),
    fontFamily: Fonts.bold,
    marginTop: scale(5),
  },
  matchName: {
    fontFamily: Fonts.bold,
    fontSize: scale(16),
    color: Color.black,
  },
  profile: {
    height: scale(50),
    width: scale(50),
    resizeMode: 'cover',
    borderRadius: scale(100),
  },
  name: {
    fontFamily: Fonts.regular,
    fontSize: scale(12),
    color: Color.black,
    paddingTop: scale(5),
  },
  profileView: {
    width: '30%',
    backgroundColor: Color.background,
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.grey,
  },
});
