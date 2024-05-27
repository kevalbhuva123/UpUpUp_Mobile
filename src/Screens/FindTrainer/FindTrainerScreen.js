import {
  FlatList,
  Image,
  ScrollView,
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

const FindTrainer = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const renderConnections = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('ViewProfileScreen');
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
        heading={'Trainers & Coaches'}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.master} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Trainers in Your Area & Your Sports</Text>
        <FlatList
          data={Connections.slice(0, 6)}
          renderItem={renderConnections}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
        />
        <Text style={styles.title}>Other Trainers & Coaches</Text>
        <FlatList
          data={Connections.slice(6, 10)}
          renderItem={renderConnections}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
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

export default FindTrainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(16),
    paddingLeft: scale(10),
    marginTop: scale(15),
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
