import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import apiConfigs from '../../api/apiconfig';

const SportsShopScreen = ({navigation}) => {
  const [Loader, setLoader] = useState(false);
  const [sportShopList, setSportShopList] = useState([]);

  useEffect(() => {
    getSportList();
  }, []);

  const getSportList = async () => {
    try {
      setLoader(true);

      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);

      const formData = new FormData();
      formData.append('user_id', userData?.id);
      formData.append('location_id', userData?.location);

      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Shop/shop_list`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setSportShopList(result?.data?.shops);
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

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
          <View
            style={{
              width: '40%',
            }}>
            <Image
              source={item?.image != '' ? {uri: item?.image} : IMAGES.LogoText}
              style={item?.image != '' ? styles.shopImage : styles.blank}
            />
          </View>
          <View
            style={{
              width: '60%',
              paddingLeft: scale(10),
              height: scale(120),
              justifyContent: 'space-between',
            }}>
            <Text numberOfLines={1} style={styles.title}>
              {item?.name}
            </Text>
            <View style={styles.iconTextView}>
              <Image source={IMAGES.Location} style={styles.icons} />
              <Text numberOfLines={1} style={styles.subText}>
                {item?.address}, {item?.area}
              </Text>
            </View>
            <View style={styles.iconTextView}>
              <Image source={IMAGES.Clock} style={styles.icons} />
              <Text style={styles.subText}>{item?.timing}</Text>
            </View>
            <View style={styles.btnView}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  openGoogleMaps(item?.lat, item?.lon);
                }}>
                <Image source={IMAGES.MapSearch} style={styles.btnIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  Linking.openURL(`tel:${item?.phone}`).catch(err =>
                    console.error('Error:', err),
                  );
                }}>
                <Image
                  source={IMAGES.Call}
                  style={[styles.btnIcon, {tintColor: Color.green}]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <FlatList
          data={(item?.sports).slice(0, 8)}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => item?.id.toString()}
          style={{paddingTop: scale(8)}}
          numColumns={8}
        />
      </View>
    );
  };

  const renderImageItem = ({item}) => (
    <View style={styles.roundBorder}>
      <Image style={styles.image} source={{uri: item?.image}} />
    </View>
  );

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Sports Shops'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Text style={styles.heading}>
          Sports Shop in <Text style={{color: Color.icon}}>Your Area</Text> &
          {'\n'}
          <Text style={{color: Color.icon}}>Your Sports</Text>
        </Text>
        <FlatList
          data={sportShopList}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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

export default SportsShopScreen;

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
  btn: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
  },
  btnView: {flexDirection: 'row', alignItems: 'center'},
  title: {fontFamily: Fonts.bold, color: Color.black, fontSize: scale(16)},
  subText: {fontFamily: Fonts.regular, color: Color.black, fontSize: scale(13)},
  btnIcon: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
  },
  card: {
    width: '100%',
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(2),
    elevation: 6,
    borderRadius: scale(10),
    backgroundColor: Color.white,
    marginBottom: scale(15),
    padding: scale(10),
  },
  roundBorder: {
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(100),
    borderWidth: scale(0.5),
    borderColor: Color.icon,
    margin: scale(5),
  },
  image: {
    height: scale(16),
    width: scale(16),
    margin: scale(5),
    tintColor: Color.icon,
    resizeMode: 'contain',
  },
  icons: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    marginRight: scale(7),
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scale(5),
  },
  shopImage: {
    height: scale(120),
    width: '100%',
    resizeMode: 'cover',
    borderRadius: scale(10),
  },
  blank: {
    height: scale(120),
    width: '100%',
    resizeMode: 'contain',
    borderRadius: scale(10),
    tintColor: Color.main,
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
