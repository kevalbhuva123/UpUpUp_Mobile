import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {Facilities, Sports} from '../../Constants/StaticData';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
const VenueDetailScreen = ({navigation}) => {
  const renderItem = ({item}) => (
    <View style={styles.iconContainer}>
      <Image source={item.image} style={styles.sportsIcons} />
    </View>
  );
  const renderFacilities = ({item}) => (
    <View style={styles.iconContainer}>
      <Text style={styles.subText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Book a Venue'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <ScrollView
          style={{flexGrow: 1, padding: scale(15)}}
          contentContainerStyle={{
            backgroundColor: Color.white,
            paddingBottom: scale(30),
          }}
          showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.subView}>
              <Text style={styles.heading}>Sports Available</Text>
              <View>
                <FlatList
                  data={Sports}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  numColumns={6}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => {
            navigation.navigate('BookNowScreen');
          }}>
          <Text style={styles.buttonText}>MAKE PAYMENT</Text>
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
    paddingTop: scale(15),
    width: '100%',
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
  submain: {
    flex: 1,
    padding: scale(20),
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Color.lightGrey,
    borderBottomWidth: scale(1),
    paddingBottom: scale(20),
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
    borderColor: Color.main,
    padding: scale(6),
  },
});
