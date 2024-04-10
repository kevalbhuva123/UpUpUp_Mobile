import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Venues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Fonts from '../../Constants/Fonts';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';

const BookVenueScreen = ({navigation}) => {
  const [venues, setVenues] = useState([]);
  const [UserId, setUserId] = useState(779);
  const [venueId, setvenueId] = useState("");
  const [sports, setsports] = useState(true);
  const [area, setarea] = useState(true);

  useEffect(() => {
    // Fetch venues data when the component mounts
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      // Retrieve user_id from storage
      // const userData = await StorageService.getItem(
      // //   StorageService.STORAGE_KEYS.USER_DETAILS
      // // );
      const UserID = "779";
      // setUserId(userId.user_id);
      // Create formData object
      const formData = new FormData();
      formData.append('user_id', UserID);
      formData.append('venue_id', venueId);
      formData.append('sports', sports);
      formData.append('area', area);

      // Make API request with formData and content type 'multipart/form-data'
      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Venue/index`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      .then(response => response.json())
      .then(data => {
        if (data.ErrorCode === 0) {
          setVenues(data.Data);
          console.error('succuss',)
        } else {
          console.error('Failed to fetch venues:', data.message);
        }
      })
      .catch(error => console.error('Error fetching venues:', error));
  } catch (error) {
    console.error('Error fetching venues:', error);
  }
};

const renderImageItem = ({ item }) => (
  <Image style={styles.image} source={{ uri: item }} />
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
          navigation.navigate('VenueDetailScreen');
        }}>
        <Image source={{ uri: item.venue_image[0] }} style={styles.venueImage} />
        <Text style={styles.heading}>{item.venue}</Text>
        <View style={styles.iconTextView}>
          <Image source={IMAGES.Location} style={styles.icons} />
          <Text style={styles.subText}>{item.area}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <FlatList
              data={item.venue_sports}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
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
      <CustomHeader
        heading={'Book Venue'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
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
  icons: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
  heading: {
    fontSize: scale(14),
    fontFamily: Fonts.semibold,
    color: Color.black,
    paddingLeft: scale(10),
    paddingTop: scale(10),
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
  },
  buttonText: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(11),
  },
});
