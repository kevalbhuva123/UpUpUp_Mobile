import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import Color from '../../Constants/Color';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MediaModal from '../../Components/MediaModal';
import apiConfigs from '../../api/apiconfig';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {isValidEmail} from '../../utlis/CommonUtils';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {Sports} from '../../Constants/StaticData';
import AlertModal from '../../Components/AlertModal';

const BeTrainerScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [DOB, setDOB] = useState('');
  const [experience, setExperience] = useState();
  const [avatarSource, setAvatarSource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  const [Loader, setLoader] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [userSports, setUserSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [age, setAge] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    try {
      setLoader(true);
      let userDetails = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>USER Details>>>', userDetails);
      setMobile(userDetails?.phone_no);

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
          setUserSports(result?.Data);
          setLoader(false);

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

  const captureImage = async () => {
    setModalVisible(false);
    let options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        return;
      } else if (response.errorCode == 'permission') {
        return;
      } else if (response.errorCode == 'others') {
        return;
      }

      console.log(response.assets[0]);
      setAvatarSource(response.assets[0]);
    });
  };

  const chooseFile = () => {
    setModalVisible(false);
    let options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        return;
      } else if (response.errorCode == 'permission') {
        return;
      } else if (response.errorCode == 'others') {
        return;
      }

      console.log(response.assets[0]);
      setAvatarSource(response.assets[0]);
    });
  };

  const calculateAge = birthDate => {
    const birthDateMoment = moment(birthDate, 'YYYY-MM-DD');
    const today = moment();
    const ages = today.diff(birthDateMoment, 'years');
    setAge(ages);
  };

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const submitProfile = async () => {
    console.log('PRESSED');
    if (avatarSource == null) {
      setWarning('Please select profile.');
      WarningMessageTimer();
      console.log('1');
      return;
    }
    if (!name.trim()) {
      setWarning('Please enter your name.');
      WarningMessageTimer();
      console.log('2');

      return;
    }
    if (!mobile.trim()) {
      setWarning('Please enter your mobile number.');
      WarningMessageTimer();
      console.log('2');

      return;
    }
    if (!address.trim()) {
      setWarning('Please enter your address.');
      WarningMessageTimer();
      console.log('3');

      return;
    }

    if (!experience.trim()) {
      setWarning('Please enter your experience.');
      WarningMessageTimer();
      console.log('5');

      return;
    }

    if (selectedSports.length == 0) {
      setWarning('Please select your sports.');
      WarningMessageTimer();
      console.log('6');
      return;
    }

    try {
      setLoader(true);
      let userDetails = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>USER Details>>>', userDetails);

      let file = {
        uri: avatarSource?.uri,
        name: avatarSource?.fileName,
        type: avatarSource?.type,
        size: avatarSource?.fileSize,
      };
      console.log(file);
      const formdata = new FormData();
      formdata.append('user_id', userDetails?.id);
      formdata.append('user_name', name);
      formdata.append('user_age', age);
      formdata.append('user_phone', mobile);
      formdata.append('user_address', address);
      formdata.append('user_experiance', experience);
      formdata.append('location_id', userDetails?.location);
      formdata.append('sports', JSON.stringify(selectedSports));
      formdata.append('file', file);
      console.log('>>>>FD>>>', formdata);
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Trainer/trainer`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          if (result?.errorCode == 0) {
            navigation.goBack();
          } else {
            setAlertMsg(result?.message);
            setAlertVisible(true);
          }
          console.log(result);
        })
        .catch(error => {
          setLoader(false);
          console.error('>>>>>>>>>', error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const renderSports = ({item}) => {
    const isSelected = selectedSports == item.id;

    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          // setSelectedSports(prevSelectedItems => {
          //   if (prevSelectedItems.includes(item?.id)) {
          //     return prevSelectedItems.filter(itemId => itemId !== item?.id);
          //   } else {
          //     if (prevSelectedItems.length < 8) {
          //       return [...prevSelectedItems, item?.id];
          //     } else {
          //       return prevSelectedItems;
          //     }
          //   }
          // });
          setSelectedSports([item.id]);
        }}>
        <View style={styles.rawView}>
          <Image
            source={isSelected ? IMAGES.CheckedRadio : IMAGES.UncheckedRadio}
            style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
          />
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
        heading={'Add as Trainer'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View style={styles.master}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <ImageBackground
              source={avatarSource === null ? IMAGES.Person : avatarSource}
              style={styles.profilePhoto}
              imageStyle={{borderRadius: scale(150)}} // adjust border radius as needed
            >
              <Image source={IMAGES.Camera} style={styles.cameraIcon} />
            </ImageBackground>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            placeholderTextColor={Color.lightGrey}
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            placeholderTextColor={Color.lightGrey}
            onChangeText={text => setMobile(text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            placeholderTextColor={Color.lightGrey}
            onChangeText={text => setAddress(text)}
          />

          <TouchableOpacity
            style={[styles.input, {justifyContent: 'center'}]}
            onPress={() => {
              setIsDateOpen(!isDateOpen);
            }}>
            <Text style={styles.dateText}>
              {DOB != '' ? DOB : 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Experience"
            value={experience}
            placeholderTextColor={Color.lightGrey}
            onChangeText={text => setExperience(text)}
            keyboardType="number-pad"
          />
          <View style={styles.subView}>
            <Text style={styles.headingTitle}>Select a Sport</Text>
            <FlatList
              data={userSports}
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
          {warning !== '' && <Text style={styles.warning}>{warning}</Text>}
          <TouchableOpacity
            onPress={() => {
              submitProfile();
            }}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>REGISTER PROFILE</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <DatePicker
        modal
        open={isDateOpen}
        date={new Date()}
        onConfirm={date => {
          console.log(date);
          setDOB(moment(date).format('YYYY-MM-DD'));
          calculateAge(moment(date).format('YYYY-MM-DD'));
          setIsDateOpen(false);
        }}
        onCancel={() => {
          setIsDateOpen(false);
        }}
        mode="date"
        buttonColor={Color.icon}
        dividerColor={Color.icon}
      />
      <ActivityLoader loading={Loader} />
      <MediaModal
        modalVisible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
        onCamera={() => {
          captureImage();
        }}
        onGallery={() => {
          chooseFile();
        }}
      />
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

export default BeTrainerScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    alignItems: 'center',
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
  loginBtn: {
    backgroundColor: Color.icon,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginTop: scale(60),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
    marginTop: scale(10),
  },
  input: {
    height: scale(40),
    width: '100%',
    borderColor: Color.lightGrey,
    borderWidth: scale(0.5),
    marginVertical: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(12),
    borderRadius: scale(10),
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(2),

    elevation: 6,
    backgroundColor: Color.white,
  },
  dateText: {fontFamily: Fonts.bold, color: Color.black, fontSize: scale(12)},
  profilePhoto: {
    width: scale(100), // adjust dimensions as needed
    height: scale(100),
    overflow: 'hidden',
    marginBottom: scale(20),
  },
  cameraIcon: {
    width: scale(25), // adjust dimensions as needed
    height: scale(25),
    position: 'absolute',
    right: scale(3),
    bottom: scale(3),
  },
  headingTitle: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.black,
    marginBottom: scale(10),
  },
  more: {
    borderWidth: scale(1),
    borderColor: Color.subBg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    height: scale(65),
    borderRadius: scale(10),
  },
  moreText: {
    fontSize: scale(10),
    fontFamily: Fonts.regular,
    color: Color.black,
    textAlign: 'center',
  },
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: Color.white,
    borderRadius: scale(10),
    flex: 1,
  },
  label: {
    marginTop: scale(5),
    textAlign: 'center',
    fontFamily: Fonts.light,
    fontSize: scale(10),
    color: Color.black,
  },
  sportIcon: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
    tintColor: Color.icon,
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
});
