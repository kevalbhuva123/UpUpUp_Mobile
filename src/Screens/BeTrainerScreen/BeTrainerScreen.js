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

const BeTrainerScreen = () => {
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

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    let vendorDetails = await StorageService.getItem(
      StorageService.STORAGE_KEYS.VENDOR_DETAILS,
    );

    console.log('>>>Vendor Details>>>', vendorDetails);
    setMobile(vendorDetails?.phone);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
      }
      return false;
    } else return true;
  };

  const captureImage = async () => {
    setModalVisible(false);
    let options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      setTimeout(() => {
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
      }, 1000);
    }
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

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const renderSports = ({item}) =>
    item.name == 'More\nSports' ? (
      <TouchableOpacity style={styles.more}>
        <Text style={styles.moreText}>{item.name}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.items}>
        <Image source={item.image} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );

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
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            placeholderTextColor={Color.lightGrey}
            onChangeText={text => setAddress(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Color.lightGrey}
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={[styles.input, {justifyContent: 'center'}]}
            onPress={() => {
              setIsDateOpen(true);
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
          <Text style={styles.headingTitle}>Select a Sport</Text>
          <View style={styles.mainBox}>
            <FlatList
              data={Sports}
              renderItem={renderSports}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              contentContainerStyle={{
                backgroundColor: Color.background,
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
    marginTop: scale(20),
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
    backgroundColor: Color.background,
    width: '25%',
    height: scale(65),
    borderRadius: scale(10),
  },
  label: {
    marginTop: scale(5),
    textAlign: 'center',
    fontFamily: Fonts.light,
    fontSize: scale(10),
    color: Color.black,
  },
  sportIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
});
