import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {Facilities, Sports, Venues} from '../../Constants/StaticData';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import Carousel from 'react-native-reanimated-carousel';

const VenueDetailScreen = ({navigation, route}) => {
  const width = Dimensions.get('window').width;

  const [venueDetails, setVenueDetails] = useState(route?.params?.data);

  const renderItem = ({item}) => (
    <View style={styles.iconContainer}>
      <Image source={{uri: item}} style={styles.sportsIcons} />
    </View>
  );
  const renderFacilities = ({item}) => (
    <View style={styles.iconContainer}>
      <Text style={styles.subText}>{item}</Text>
    </View>
  );

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Venue Detail'}
        onBackPress={() => navigation.navigate('BookVenueScreen')}
      />
      <View style={styles.master}>
        <ScrollView
          style={{flexGrow: 1}}
          contentContainerStyle={{
            backgroundColor: Color.background,
            paddingBottom: scale(30),
          }}
          showsVerticalScrollIndicator={false}>
          <View>
            <Carousel
              loop
              style={{backgroundColor: Color.background}}
              width={width}
              height={scale(200)}
              autoPlay={true}
              // data={Venues}
              data={(venueDetails?.venue_image).concat(
                venueDetails?.gallery_image,
              )}
              scrollAnimationDuration={1000}
              onSnapToItem={index => {}}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{uri: item}}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </TouchableOpacity>
              )}
            />
            <View style={styles.headingView}>
              <View style={{width: '80%'}}>
                <Text style={styles.heading}>{venueDetails?.venue}</Text>
                <Text style={styles.subText}>{venueDetails?.area}</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: '20%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  openGoogleMaps(venueDetails?.lat, venueDetails?.lon);
                }}>
                <Image source={IMAGES.MapSearch} style={styles.mapSearch} />
              </TouchableOpacity>
            </View>
            <View style={styles.subMain}>
              <View style={styles.subView}>
                <Text style={styles.heading}>Timing</Text>
                <Text style={styles.subText}>
                  Opening :{' '}
                  <Text style={styles.valueText}>{venueDetails?.morning}</Text>
                </Text>
                <Text style={styles.subText}>
                  Closing :{' '}
                  <Text style={styles.valueText}>{venueDetails?.evening}</Text>
                </Text>
              </View>
              <View style={styles.subView}>
                <Text style={styles.heading}>Sports Available</Text>
                <FlatList
                  data={venueDetails?.venue_sports_image}
                  renderItem={renderItem}
                  keyExtractor={item => item}
                  numColumns={6}
                />
              </View>
              <View style={styles.subView}>
                <Text style={styles.heading}>More About Venue</Text>
                <Text style={styles.subText}>{venueDetails?.description}</Text>
              </View>
              <View style={styles.subView}>
                <Text style={styles.heading}>Facilities</Text>
                <FlatList
                  data={venueDetails?.facility}
                  renderItem={renderFacilities}
                  keyExtractor={item => item}
                  // numColumns={6}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => {
            navigation.navigate('BookNowScreen', {data: venueDetails});
          }}>
          <Text style={styles.buttonText}>BOOK NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VenueDetailScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
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
  moreAboutView: {
    borderRadius: scale(10),
    borderWidth: scale(1),
    borderColor: Color.lightGrey,
    padding: scale(15),
    marginTop: scale(5),
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
  valueText: {
    fontFamily: Fonts.semibold,
    color: Color.black,
    fontSize: scale(12),
  },
  venueImage: {
    width: '100%',
    height: scale(180),
    resizeMode: 'cover',
  },
  mapSearch: {
    height: scale(40),
    width: scale(40),
    resizeMode: 'contain',
  },
  subMain: {
    padding: scale(20),
    backgroundColor: Color.background,
    flex: 1,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Color.lightGrey,
    borderBottomWidth: scale(1),
    width: '100%',
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
    backgroundColor: Color.white,
  },
  heading: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(5),
  },
  subText: {
    fontFamily: Fonts.regular,
    fontSize: scale(12),
    color: Color.black,
  },
  sportsIcons: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: scale(5),
    borderWidth: scale(1),
    borderRadius: scale(100),
    borderColor: Color.icon,
    padding: scale(6),
  },
});
