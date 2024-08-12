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
import {UpcomingBooking} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import RatingModal from '../../Components/RatingModal';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';
import moment from 'moment';

const MyBookingScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);

  const [Loader, setLoader] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    getUpcomingBookings();
  }, []);

  const getUpcomingBookings = async () => {
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
        `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/upcoming_booking/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result?.ErrorCode == 0) {
            setUpcomingBookings(result?.Data);
          }
          setLoader(false);
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const pastBookingList = async () => {
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
        `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/past_booking/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result?.ErrorCode == 0) {
            setPastBookings(result?.Data);
          }
          setLoader(false);
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
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
          <Image
            source={item?.image != '' ? {uri: item?.image} : IMAGES.LogoText}
            style={styles.sportIcon}
          />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.heading} numberOfLines={2}>
            {item?.venue}
          </Text>
          <Text style={styles.subText}>Booked by: {item?.name}</Text>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Clock} style={styles.icons} />
            <Text style={styles.subText}>
              {item?.court_timing[0]}-
              {addOneHour(item?.court_timing[item?.court_timing.length - 1])}
            </Text>
          </View>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Location} style={styles.icons} />
            <Text style={styles.subText}>{item?.area}</Text>
          </View>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.dateView}>
          <Text style={[styles.subText, {color: Color.icon}]}>
            {moment(item?.date).format('MMMM')}
          </Text>
          <Text style={[styles.heading, {color: Color.main}]}>
            {moment(item?.date).format('DD')}
          </Text>
          <Text style={styles.subText}>{moment(item?.date).year()}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderRate = ({item}) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconView}>
          <Image
            source={item?.image != '' ? {uri: item?.image} : IMAGES.LogoText}
            style={styles.sportIcon}
          />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.heading} numberOfLines={2}>
            {item?.venue}
          </Text>
          <Text style={styles.subText}>Booked by: {item?.name}</Text>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Clock} style={styles.icons} />
            <Text style={styles.subText}>
              {item?.court_timing[0]}-
              {addOneHour(item?.court_timing[item?.court_timing.length - 1])}
            </Text>
          </View>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Location} style={styles.icons} />
            <Text style={styles.subText}>{item?.area}</Text>
          </View>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.dateView}>
          <Text style={[styles.subText, {color: Color.icon}]}>
            {moment(item?.date).format('MMMM')}
          </Text>
          <Text style={[styles.heading, {color: Color.main}]}>
            {moment(item?.date).format('DD')}
          </Text>
          <Text style={styles.subText}>{moment(item?.date).year()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const addOneHour = time => {
    let [hours, minutes] = time.split(':');
    let period = time.slice(-2);

    hours = parseInt(hours, 10);
    minutes = minutes.slice(0, -3);

    hours += 1;

    if (hours === 12) {
      period = period === 'AM' ? 'PM' : 'AM';
    } else if (hours > 12) {
      hours -= 12;
      period = period === 'AM' ? 'PM' : 'AM';
    }

    return `${hours}:${minutes} ${period}`;
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Bookings'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.headingView}>
          <TouchableOpacity
            style={activeTab == 1 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(1);
              setPastBookings([]);
              getUpcomingBookings();
            }}>
            <Text style={styles.tabText}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab == 2 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(2);
              setUpcomingBookings([]);
              pastBookingList();
            }}>
            <Text style={styles.tabText}>History</Text>
          </TouchableOpacity>
        </View>
        {activeTab == 1 ? (
          <FlatList
            data={upcomingBookings}
            renderItem={renderItem}
            keyExtractor={item => item.booking_id.toString()}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyComponent}
          />
        ) : (
          <FlatList
            data={pastBookings}
            renderItem={renderRate}
            keyExtractor={item => item.booking_id.toString()}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyComponent}
          />
        )}
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default MyBookingScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
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
    width: scale(50),
    height: scale(50),
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
    width: '50%',
    justifyContent: 'center',
    paddingVertical: scale(10),
    height: scale(120),
    justifyContent: 'space-between',
  },
  dateView: {
    width: '20%',
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
    height: scale(60),
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '65%',
    fontSize: scale(10),
    paddingVertical: scale(3),
    fontFamily: Fonts.bold,
    marginTop: scale(3),
  },
});
