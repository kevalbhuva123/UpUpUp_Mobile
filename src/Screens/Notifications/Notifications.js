import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import IMAGES from '../../Assets/Icons/index';

const Notifications = ({navigation}) => {
  const [Loader, setLoader] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [offerNotificationList, setOfferNotificationList] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    getNotificationList();
  }, []);

  const getNotificationList = async () => {
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
        `${apiConfigs.LOCAL_SERVER_API_URL}/Notification/index/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setNotificationList(result?.Data);
          console.log(result);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  const getOfferNotificationList = async () => {
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
        `${apiConfigs.LOCAL_SERVER_API_URL}/Notification/offer_notification/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setOfferNotificationList(result?.Data);
          console.log(result);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('VenueDetailScreen', {data: item});
        }}>
        <Image
          source={item?.image != '' ? {uri: item?.image} : IMAGES.LogoText}
          style={item?.image != '' ? styles.imgIcon : styles.blank}
        />
        <View
          style={{
            height: scale(70),
            paddingHorizontal: scale(10),
            width: '70%',
          }}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.venue?.trim()}
          </Text>
          <Text style={styles.subText}>{item?.offer?.trim()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOfferItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.card}>
        <Image
          source={item?.image != '' ? {uri: item?.image} : IMAGES.LogoText}
          style={item?.image != '' ? styles.imgIcon : styles.blank}
        />
        <View
          style={{
            // height: scale(70),
            paddingHorizontal: scale(10),
            width: '70%',
          }}>
          <Text style={styles.title}>{item?.title?.trim()}</Text>
          <Text style={styles.subText}>{item?.message?.trim()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Notifications'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.headingView}>
          <TouchableOpacity
            style={activeTab == 1 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(1);
              getNotificationList();
            }}>
            <Text style={styles.tabText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab == 2 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(2);
              getOfferNotificationList();
            }}>
            <Text style={styles.tabText}>Offers</Text>
          </TouchableOpacity>
        </View>
        {activeTab == 1 && (
          <FlatList
            data={notificationList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={EmptyComponent}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab == 2 && (
          <FlatList
            data={offerNotificationList}
            renderItem={renderOfferItem}
            keyExtractor={item => item.venue_id.toString()}
            ListEmptyComponent={EmptyComponent}
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

export default Notifications;

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
  title: {
    fontFamily: Fonts.bold,
    fontSize: scale(16),
    color: Color.black,
  },
  subText: {
    fontFamily: Fonts.regular,
    fontSize: scale(14),
    color: Color.black,
    paddingTop: scale(5),
  },
  card: {
    width: '100%',
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(2),
    elevation: 6,
    borderRadius: scale(10),
    backgroundColor: Color.white,
    marginBottom: scale(15),
    padding: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgIcon: {
    height: scale(70),
    width: scale(70),
    resizeMode: 'cover',
    borderRadius: scale(10),
  },
  blank: {
    height: scale(70),
    width: scale(70),
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
    marginTop: scale(100),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
  },
});
