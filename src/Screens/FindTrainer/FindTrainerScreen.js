import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Connections} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import RatingModal from '../../Components/RatingModal';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import IMAGES from '../../Assets/Icons/index';
import {useFocusEffect} from '@react-navigation/native';

const FindTrainer = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [Loader, setLoader] = useState(false);
  const [trainerList, setTrainerList] = useState();

  useEffect(() => {
    getTrainerList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTrainerList();
    }, []),
  );

  const getTrainerList = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('location_id', userData?.location);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Trainer/trainer_list`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setTrainerList(result?.data);
          console.log('>>>>>', result);
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
          navigation.navigate('ViewProfileScreen', {data: item});
        }}>
        <Image source={IMAGES.Person} style={styles.image} />
        <Text style={[styles.heading, {textAlign: 'center'}]}>
          {item.name ? item.name : '-'}
        </Text>
        <Text style={styles.subText}>
          {item?.speciality ? item?.speciality : '-'}
        </Text>
        <Text style={styles.numberText}>
          Exp. {item?.experience ? item?.experience : '-'}{' '}
          {item?.experience.length > 2 ? '' : 'yrs'}
        </Text>
        <Text style={styles.statusView}>{item?.total_followers} Followers</Text>
        <Text style={styles.subText}>
          {item?.location ? item?.location : '-'}
        </Text>
      </TouchableOpacity>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

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
          data={trainerList?.trainers}
          renderItem={renderConnections}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{flexGrow: 1}}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
        />
        <Text style={styles.title}>Other Trainers & Coaches</Text>
        <FlatList
          data={trainerList?.other_trainers}
          renderItem={renderConnections}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={{flexGrow: 1}}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      <ActivityLoader loading={Loader} />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: scale(150),
    height: scale(150),
    resizeMode: 'contain',
    marginTop: scale(50),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
    marginBottom: scale(20),
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
    marginVertical: scale(5),
    backgroundColor: Color.main,
    color: Color.white,
  },
  card: {
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    elevation: 6,
    borderRadius: scale(10),
    width: '44%',
    margin: '3%',
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
    textAlign: 'center',
  },
  numberText: {
    fontFamily: Fonts.bold,
    color: Color.icon,
    fontSize: scale(14),
  },
});
