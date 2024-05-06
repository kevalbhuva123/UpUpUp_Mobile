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
import {RateFriend} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {Rating} from 'react-native-ratings';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const RateFriendScreen = ({navigation}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={[styles.subView, {width: '30%'}]}>
          <Image source={item.image} style={styles.iconImage} />
          <Text style={styles.heading}>{item.name}</Text>
        </View>
        <View style={[styles.subView, {width: '45%'}]}>
          <Text style={styles.heading}>PROFESSIONAL</Text>
          <Rating
            startingValue={item.rating}
            imageSize={scale(15)}
            ratingColor={Color.main}
            ratingBackgroundColor={Color.main}
            style={{marginVertical: scale(5)}}
            readonly
          />
          <Text style={styles.subText}>{item.noOfRating} Rating</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={[styles.subView, {width: '25%'}]}>
          <Text style={styles.numberText}>
            {('0' + item.matched).slice(-2)}
          </Text>
          <Text style={styles.regularText}>Matches</Text>
          <Text style={styles.regularText}>Played</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Rate a friend'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <FlatList
          data={RateFriend}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={{flex: 1}}
          contentContainerStyle={{
            paddingTop: scale(20),
            paddingHorizontal: scale(20),
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default RateFriendScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  iconImage: {
    height: scale(35),
    width: scale(35),
    resizeMode: 'contain',
    tintColor: Color.icon,
    marginBottom: scale(5),
  },
  card: {
    width: '100%',
    backgroundColor: Color.white,
    borderRadius: scale(10),
    elevation: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
    paddingVertical: scale(20),
    paddingHorizontal: scale(15),
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: scale(12),
    color: Color.black,
  },
  subText: {
    fontFamily: Fonts.regular,
    fontSize: scale(10),
    color: Color.black,
  },
  subView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: scale(50),
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
  },
  regularText: {
    fontFamily: Fonts.regular,
    fontSize: scale(12),
    color: Color.black,
  },
  numberText: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.icon,
  },
});
