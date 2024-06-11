import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {UpComingMyMatches} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import RatingModal from '../../Components/RatingModal';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import apiConfigs from '../../api/apiconfig';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import moment from 'moment';

const MyMatchesScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [Loader, setLoader] = useState(false);
  const [pastMatchList, setPastMatchList] = useState([]);
  const [upComingMatchList, setUpComingMatchList] = useState([]);

  useEffect(() => {
    getUpcomingMatches();
  }, []);

  const getUpcomingMatches = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/upcoming_matches/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setUpComingMatchList(result?.Data);
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
  const getPastMatches = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/past_matches/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setPastMatchList(result?.Data);
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

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconView}>
          <Image source={{uri: item.sports_image}} style={styles.sportIcon} />
        </View>
        <View style={{width: '70%'}}>
          <View style={styles.subView}>
            <View style={styles.contentView}>
              <Text style={[styles.heading, {width: '80%'}]} numberOfLines={1}>
                {item.match_name}
              </Text>
              <Text style={[styles.subText, {width: '80%'}]} numberOfLines={1}>
                Posted by: {item.hostedBy}
              </Text>
              <View style={styles.iconTextView}>
                <Image source={IMAGES.Location} style={styles.icons} />
                <Text style={styles.subText}>{item.area}</Text>
              </View>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.dateView}>
              <Text style={[styles.subText, {color: Color.icon}]}>
                {moment(item.date).format('MMM').toUpperCase()}
              </Text>
              <Text style={[styles.heading, {color: Color.main}]}>
                {moment(item.date).format('DD')}
              </Text>
              <Text style={styles.subText}>
                {moment(item.date).format('YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.subView2}>
            <Text
              style={[
                styles.statusView,
                {
                  backgroundColor:
                    item.status == 'Request'
                      ? Color.icon
                      : item.status == 'Accepted'
                      ? Color.green
                      : item.status == 'Pending'
                      ? Color.yellow
                      : Color.main,
                  color: Color.white,
                },
              ]}>
              {item.status}
            </Text>
            <View style={styles.timeView}>
              <Image
                source={IMAGES.Morning}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Morning' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Afternoon}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Afternoon' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Evening}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Evening' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Night}
                style={[
                  styles.icons,
                  {tintColor: item.time == 'Night' ? Color.icon : Color.black},
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPastMatches = ({item}) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => {}}>
        <View style={styles.iconView}>
          <Image source={{uri: item?.sports_image}} style={styles.sportIcon} />
        </View>
        <View style={{width: '70%'}}>
          <View style={styles.subView}>
            <View style={styles.contentView}>
              <Text style={[styles.heading, {width: '80%'}]} numberOfLines={1}>
                {item.match_name}
              </Text>
              <Text style={[styles.subText, {width: '80%'}]} numberOfLines={1}>
                Posted by: {item.hostedBy}
              </Text>
              <View style={styles.iconTextView}>
                <Image source={IMAGES.Location} style={styles.icons} />
                <Text style={styles.subText}>{item.area}</Text>
              </View>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.dateView}>
              <Text style={[styles.subText, {color: Color.icon}]}>
                {moment(item.date).format('MMM').toUpperCase()}
              </Text>
              <Text style={[styles.heading, {color: Color.main}]}>
                {moment(item.date).format('DD')}
              </Text>
              <Text style={styles.subText}>
                {moment(item.date).format('YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.subView2}>
            <Text
              style={[
                styles.statusView,
                {
                  backgroundColor:
                    item.status == 'REQUEST'
                      ? Color.icon
                      : item.status == 'ACCEPTED'
                      ? Color.green
                      : item.status == 'PENDING'
                      ? Color.yellow
                      : Color.main,
                  color: Color.white,
                },
              ]}>
              {item.status}
            </Text>
            <View style={styles.timeView}>
              <Image
                source={IMAGES.Morning}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Morning' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Afternoon}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Afternoon' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Evening}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Evening' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Night}
                style={[
                  styles.icons,
                  {tintColor: item.time == 'Night' ? Color.icon : Color.black},
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Matches'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.headingView}>
          <TouchableOpacity
            style={activeTab == 1 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(1);
              getUpcomingMatches();
            }}>
            <Text style={styles.tabText}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab == 2 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(2);
              getPastMatches();
            }}>
            <Text style={styles.tabText}>Past Matches</Text>
          </TouchableOpacity>
        </View>
        {activeTab == 1 ? (
          <FlatList
            data={upComingMatchList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={pastMatchList}
            renderItem={renderPastMatches}
            keyExtractor={item => item.id.toString()}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default MyMatchesScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  headingView: {
    backgroundColor: Color.white,
    paddingVertical: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(25),
  },
  tabActiveButton: {
    backgroundColor: Color.subBg,
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    borderRadius: scale(100),
  },
  tabButton: {
    borderWidth: scale(1),
    borderColor: Color.subBg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '49%',
    paddingVertical: scale(10),
    borderRadius: scale(100),
  },
  tabText: {
    fontSize: scale(13),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  card: {
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: scale(10),
    marginBottom: scale(15),
  },
  sportIcon: {
    width: scale(60),
    height: scale(60),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  icons: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  contentView: {
    width: '70%',
    justifyContent: 'center',
    paddingTop: scale(10),
    height: scale(80),
    justifyContent: 'space-between',
  },
  dateView: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: scale(14),
    fontFamily: Fonts.semibold,
    color: Color.black,
  },
  subText: {
    fontSize: scale(12),
    fontFamily: Fonts.regular,
    color: Color.black,
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: scale(50),
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '50%',
    fontSize: scale(10),
    paddingVertical: scale(3),
    fontFamily: Fonts.bold,
    marginTop: scale(3),
  },
  subView: {width: '100%', flexDirection: 'row', alignItems: 'center'},
  subView2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
  },
  timeView: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
