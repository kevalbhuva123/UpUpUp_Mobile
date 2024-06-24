import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import LinearGradient from 'react-native-linear-gradient';
import {Sports} from '../../Constants/StaticData';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import AlertModal from '../../Components/AlertModal';
import {useToast} from 'react-native-toast-notifications';

const MySportScreen = ({navigation}) => {
  const toast = useToast();

  const [editEnable, setEditEnable] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const [mySports, setMySports] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    fetchSportsData();
  }, []);

  const fetchSportsData = async () => {
    try {
      setLoader(true);

      let userDetails = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>USER Details>>>', userDetails);

      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Sports/get_user_sports/${userDetails?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log('>>>RESULT>>>', result);
          setMySports(result?.Data);
          const requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Sports/index`,
            requestOptions,
          )
            .then(response => response.json())
            .then(data => {
              setLoader(false);
              setSportsData(data?.Data);
              console.log(data);
            })
            .catch(error => {
              setLoader(false);
              console.error(error);
            });
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

  const submitSports = async () => {
    try {
      setLoader(true);

      let userDetails = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      const ids = mySports.map(sport => sport.id);
      console.log('>>>>IDS>>>>>', ids);
      const formdata = new FormData();
      formdata.append('user_id', userDetails?.id);
      formdata.append('sports', JSON.stringify(ids));
      console.log('>>>>>>FD>>>>', formdata);
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Sports/edit_user_sports`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          console.log(result);
          setAlertMsg('Sports Updated Successfully.');
          setAlertVisible(true);
        })
        .catch(error => {
          setLoader(false);

          console.error(error);
        });
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const renderSports = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setMySports(prevItems => {
            const itemIndex = prevItems.findIndex(i => i.id === item.id);
            if (itemIndex !== -1) {
              const updatedItems = [...prevItems];
              updatedItems.splice(itemIndex, 1);
              return updatedItems;
            }
            return prevItems;
          });
        }}>
        <View style={styles.closeView}>
          <Image source={IMAGES.Close} style={styles.closeIcon} />
        </View>
        <Image source={{uri: item.image}} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.sports}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setMySports(prevItems => {
            const itemExists = prevItems.some(i => i.id === item.id);
            if (!itemExists) {
              if (mySports.length < 8) {
                return [...prevItems, item];
              } else {
                toast.show('Max 8 sports you can select.', {
                  type: 'danger',
                  placement: 'top',
                  duration: 3000,
                  offset: 30,
                  animationType: 'slide-in',
                });
              }
            }
            return prevItems;
          });
        }}>
        <View style={styles.rawView}>
          <Image source={IMAGES.CheckedRadio} style={styles.checkedIcon} />
        </View>
        <Image source={{uri: item.image}} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.sports}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Sports'}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.master}>
          <View style={styles.subView}>
            <Text style={styles.headingTitle}>
              Selected Sports{' '}
              <Text style={styles.subText}>(Max. 8 sports)</Text>
            </Text>
            <FlatList
              data={mySports}
              renderItem={renderSports}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              contentContainerStyle={{
                backgroundColor: Color.white,
                width: '100%',
                borderRadius: scale(10),
              }}
            />
          </View>
          <View style={styles.subView}>
            <Text style={styles.headingTitle}>
              Other Sports{'\n'}
              <Text style={styles.subText}>
                (Select from below list to add sports in my sports)
              </Text>
            </Text>
            <FlatList
              data={sportsData}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              contentContainerStyle={{
                backgroundColor: Color.white,
                width: '100%',
                borderRadius: scale(10),
              }}
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          submitSports();
        }}
        style={styles.loginBtn}>
        <Text style={styles.btnText}>UPDATE SPORTS</Text>
      </TouchableOpacity>
      <ActivityLoader loading={Loader} />
      <AlertModal
        modalVisible={alertVisible}
        onClose={async () => {
          setAlertVisible(false);
          navigation.goBack();
        }}
        content={alertMsg}
      />
    </View>
  );
};

export default MySportScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
  },
  subText: {
    fontFamily: Fonts.regular,
    fontSize: scale(12),
    color: Color.black,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginVertical: scale(15),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
  },
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: Color.white,
    borderRadius: scale(10),
    width: '25%',
  },
  rawView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
  },
  headingTitle: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.black,
    marginBottom: scale(10),
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
    marginTop: scale(15),
  },
  item: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    backgroundColor: Color.white,
    width: '33.3%',
  },
  label: {
    marginTop: scale(7),
    textAlign: 'center',
    fontFamily: Fonts.regular,
    color: Color.black,
    fontSize: scale(10),
  },
  sportIcon: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  closeIcon: {
    height: scale(15),
    width: scale(15),
    resizeMode: 'contain',
  },
  closeView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: scale(3),
  },
  mainBox: {
    width: '100%',
    elevation: 6,
  },
  headingBox: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    backgroundColor: Color.white,
    borderBottomColor: Color.lightGrey,
    borderBottomWidth: scale(1),
  },
  headingText: {
    fontSize: scale(16),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  editIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
  editButton: {
    height: scale(50),
    width: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    height: scale(150),
    width: '100%',
    marginTop: scale(20),
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  more: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
    marginBottom: scale(15),
  },
  bottomText: {
    fontSize: scale(14),
    color: Color.white,
    fontFamily: Fonts.bold,
  },
});
