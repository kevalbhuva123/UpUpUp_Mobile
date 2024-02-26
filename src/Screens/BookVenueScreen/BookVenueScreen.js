import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Venues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Fonts from '../../Constants/Fonts';

const BookVenueScreen = ({navigation}) => {
  const renderImageItem = ({item}) => (
    <Image style={styles.image} source={item.image} />
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
        <Image source={item.venueImage} style={styles.venueImage} />
        <Text style={styles.heading}>{item.venueName}</Text>
        <View style={styles.iconTextView}>
          <Image source={IMAGES.Location} style={styles.icons} />
          <Text style={styles.subText}>{item.location}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <FlatList
              data={item.availableSports.slice(0, 4)}
              renderItem={renderImageItem}
              keyExtractor={item => item.id}
              horizontal
            />
            {renderRemainingCount(item.availableSports)}
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
          data={Venues}
          renderItem={renderVenues}
          keyExtractor={item => item.id.toString()}
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
