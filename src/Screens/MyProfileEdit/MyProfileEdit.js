import React, {useState} from 'react';
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

const MyProfileEdit = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [avatarSource, setAvatarSource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  const [Loader, setLoader] = useState(false);

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
    });
  };

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const submitProfile = () => {
    try {
      const formdata = new FormData();
      formdata.append('user_id', '2281');
      formdata.append('name', 'Keval');
      formdata.append('email', 'keval.bhuva@upsmartsolutions.com');

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Users/update_profile`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Error:', error);
    }
  };
  return (
    <View style={styles.main}>
      <CustomHeader
        heading={'Edit Profile'}
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
            placeholder="Email"
            placeholderTextColor={Color.lightGrey}
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
          />
          <TouchableOpacity
            onPress={() => {
              submitProfile();
            }}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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

export default MyProfileEdit;

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
});
