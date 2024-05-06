import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Connections} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import RatingModal from '../../Components/RatingModal';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const MyConnectionScreen = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const renderConnections = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setVisible(true);
        }}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.heading}>{item.name}</Text>
        <Text style={styles.subText}>Matches with you</Text>
        <Text style={styles.numberText}> {('0' + item.matched).slice(-2)}</Text>
        <Text style={styles.statusView}>RATE NOW</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Connections'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <FlatList
          data={Connections}
          renderItem={renderConnections}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <RatingModal
        isVisible={visible}
        onClose={() => {
          setVisible(false);
          setRating(0);
        }}
        rating={rating}
        setRating={rating => {
          setRating(rating);
        }}
        handleRatingSubmit={() => {
          console.log(rating);
          setVisible(false);
        }}
        buttonText={'RATE PROFILE'}
      />
    </View>
  );
};

export default MyConnectionScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  image: {
    height: scale(75),
    width: scale(75),
    resizeMode: 'cover',
    borderRadius: scale(100),
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
    paddingVertical: scale(20),
    flex: 1,
    margin: scale(10),
    elevation: 6,
    borderRadius: scale(10),
  },
  heading: {
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    color: Color.main,
    paddingTop: scale(5),
  },
  subText: {
    fontSize: scale(12),
    fontFamily: Fonts.regular,
    color: Color.black,
  },
  numberText: {
    fontFamily: Fonts.bold,
    color: Color.icon,
    fontSize: scale(14),
  },
});
