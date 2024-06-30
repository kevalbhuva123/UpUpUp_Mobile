import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Connections} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import RatingModal from '../../Components/RatingModal';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import IMAGES from '../../Assets/Icons/index';
import {ActivityLoader} from '../../Components/Loader/Loader';

const MyConnectionScreen = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [Loader, setLoader] = useState(false);
  const [connectionList, setConnectionList] = useState([]);

  useEffect(() => {
    getConnectionApi();
  }, []);

  const getConnectionApi = async () => {
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
        `${apiConfigs.LOCAL_SERVER_API_URL}/Users/co_players/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setConnectionList(result?.Data);
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

  const renderConnections = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setVisible(true);
        }}>
        <Image
          source={
            item?.co_player_image != ''
              ? {uri: item?.co_player_image}
              : IMAGES.Profile
          }
          style={styles.image}
        />
        <Text style={styles.heading}>{item.co_player}</Text>
        <Text style={styles.subText}>Matches with you</Text>
        <Text style={styles.numberText}>
          {' '}
          {('0' + item.matches_played).slice(-2)}
        </Text>
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
          data={connectionList}
          renderItem={renderConnections}
          keyExtractor={item => item.co_player_id.toString()}
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
      <ActivityLoader loading={Loader} />
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
