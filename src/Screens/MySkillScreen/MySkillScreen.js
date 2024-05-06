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
import {Rating} from 'react-native-ratings'; // Assuming you have a Rating component library installed
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const MySkillScreen = ({navigation}) => {
  const renderSkills = ({item}) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => {}}>
        <View style={styles.subView}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.heading}>{item.name}</Text>
        </View>
        <Text style={styles.subText}>Match Played</Text>
        <Text style={styles.numberText}> {('0' + item.matched).slice(-2)}</Text>
        <View style={styles.separator}></View>
        <Text style={styles.subText}>{'Professional'}</Text>
        <Rating
          startingValue={item.rating}
          imageSize={scale(15)}
          ratingColor={Color.main}
          ratingBackgroundColor={Color.main}
          style={{marginBottom: scale(15), marginTop: scale(5)}}
          readonly
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Skills'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <FlatList
          data={RateFriend}
          renderItem={renderSkills}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default MySkillScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(10),
  },
  image: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
    tintColor: Color.white,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '65%',
    fontSize: scale(10),
    paddingVertical: scale(3),
    fontFamily: Fonts.bold,
    marginTop: scale(5),
    backgroundColor: Color.main,
    color: Color.white,
  },
  card: {
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    margin: scale(10),
    elevation: 6,
    borderRadius: scale(10),
    width: '44%',
  },
  heading: {
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    color: Color.white,
    paddingTop: scale(5),
  },
  subText: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    color: Color.black,
    paddingTop: scale(10),
  },
  numberText: {
    fontFamily: Fonts.bold,
    color: Color.icon,
    fontSize: scale(14),
  },
  subView: {
    backgroundColor: Color.main,
    width: '100%',
    paddingVertical: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  separator: {
    width: '70%',
    marginTop: scale(10),
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
  },
});
