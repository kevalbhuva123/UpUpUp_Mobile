import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Venues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Fonts from '../../Constants/Fonts';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';

const BookVenueScreen = ({navigation}) => {
  const [venues, setVenues] = useState([]);
  const [venueId, setvenueId] = useState('');
  const [sports, setsports] = useState('false');
  const [area, setarea] = useState('false');
  const [Loader, setLoader] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [sports, area]);

  const fetchVenues = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('venue_id', '');
      formdata.append('sports', sports);
      formdata.append('area', area);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Venue/index`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false);
          if (data.ErrorCode === 0) {
            setVenues(data.Data);
            console.log('succuss', data.Data[0].venue_image[0]);
          } else {
            console.error('Failed to fetch venues:', data.message);
          }
        })
        .catch(error => {
          setLoader(false), console.error('Error fetching venues:', error);
        });
    } catch (error) {
      console.error('Error fetching venues:', error);
      setLoader(false);
    }
  };

  const renderImageItem = ({item}) => (
    <View style={styles.roundBorder}>
      <Image style={styles.image} source={{uri: item?.image}} />
    </View>
  );

  const renderRemainingCount = item => {
    const remainingCount = item.length - 4;
    if (remainingCount > 0) {
      return <Text style={styles.subText}>{`+${remainingCount} more`}</Text>;
    }
    return null;
  };

  const renderVenues = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('VenueDetailScreen', {data: item});
        }}>
        <Image source={{uri: item.venue_image[0]}} style={styles.venueImage} />

        <View style={styles.titleView}>
          <Text style={styles.heading}>{item.venue}</Text>
          <View style={styles.titleLeft}>
            <Image source={IMAGES.Star} style={styles.star} />
            <Text style={styles.heading}>{item?.rating}</Text>
          </View>
        </View>
        <View style={styles.iconTextView}>
          <Image source={IMAGES.Location} style={styles.icons} />
          <Text style={styles.subText}>{item.area}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <FlatList
              data={(item?.venue_sports_2).slice(0, 4)}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
            {renderRemainingCount(item)}
          </View>
          <View style={styles.bookNow}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Book Venue'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.filterView}>
          <View style={styles.bookNow}>
            <Text style={styles.buttonText}>Filter By</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              sports == 'true' ? setsports('false') : setsports('true');
            }}
            style={styles.filterBtn}>
            <Image
              source={sports == 'true' ? IMAGES.Checked : IMAGES.Unchecked}
              style={
                sports == 'true' ? styles.checkedIcon : styles.unCheckedIcon
              }
            />
            <Text
              style={[
                styles.heading,
                {color: Color.icon, marginLeft: scale(5)},
              ]}>
              Sports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              area == 'true' ? setarea('false') : setarea('true');
            }}
            style={styles.filterBtn}>
            <Image
              source={area == 'true' ? IMAGES.Checked : IMAGES.Unchecked}
              style={area == 'true' ? styles.checkedIcon : styles.unCheckedIcon}
            />
            <Text
              style={[
                styles.heading,
                {color: Color.icon, marginLeft: scale(5)},
              ]}>
              Area
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={venues}
          renderItem={renderVenues}
          keyExtractor={(item, index) => index.toString()}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            padding: scale(10),
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default BookVenueScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  filterView: {
    width: '100%',
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.white,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  venueImage: {
    width: '100%',
    height: scale(120),
    resizeMode: 'cover',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  card: {
    width: '100%',
    elevation: 6,
    borderRadius: scale(10),
    backgroundColor: Color.white,
    marginBottom: scale(15),
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(10),
    paddingTop: scale(5),
  },
  star: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    marginRight: scale(3),
  },
  roundBorder: {
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(100),
    borderWidth: scale(0.5),
    borderColor: Color.icon,
    marginRight: scale(3),
  },
  icons: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
  titleView: {
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.green,
    padding: scale(2),
    width: '15%',
    justifyContent: 'center',
    borderRadius: scale(5),
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(10),
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  bookNow: {
    borderRadius: scale(100),
    backgroundColor: Color.main,
    alignItems: 'center',
    justifyContent: 'center',
    width: '35%',
    paddingVertical: scale(7),
  },
  image: {
    height: scale(16),
    width: scale(16),
    margin: scale(5),
    tintColor: Color.icon,
    resizeMode: 'contain',
  },
  buttonText: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(11),
  },
});
