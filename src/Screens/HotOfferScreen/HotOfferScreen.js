import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {ActivityLoader} from '../../Components/Loader/Loader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';

const HotOfferScreen = ({navigation}) => {
  const [Loader, setLoader] = useState(false);
  const [hotOfferList, setHotOfferList] = useState([]);

  useEffect(() => {
    getHotOfferList();
  }, []);

  const getHotOfferList = async () => {
    try {
      setLoader(true);

      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);

      const formdata = new FormData();
      formdata.append('user_id', userData?.id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Hotoffer/user_hotoffer_list`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setHotOfferList(result?.data);
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

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity>
        <Text>dsds</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Hot Offers'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Text style={styles.heading}>
          Hot Offers in <Text style={{color: Color.icon}}>Your Area</Text> &
          {'\n'}
          <Text style={{color: Color.icon}}>Your Sports</Text>
        </Text>
        <FlatList
          data={hotOfferList}
          renderItem={renderItem}
          keyExtractor={item => item?.id?.toString()}
          ListEmptyComponent={EmptyComponent}
          style={{flex: 1}}
          contentContainerStyle={{
            paddingTop: scale(20),
            paddingHorizontal: scale(20),
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default HotOfferScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  heading: {
    color: Color.main,
    paddingTop: scale(10),
    paddingLeft: scale(20),
    fontFamily: Fonts.bold,
    fontSize: scale(16),
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
    marginTop: scale(100),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
  },
});
