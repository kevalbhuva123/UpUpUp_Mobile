import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Color from '../../Constants/Color';
import {scale, verticalScale} from '../../utlis/Scale';
import {useNavigation} from '@react-navigation/native';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import LogoutModal from '../LogoutModal';
import DeviceInfo from 'react-native-device-info';
import StorageService from '../../utlis/StorageService';

const SidebarOptionsForUser = [
  {
    id: 1,
    title: 'My Profile',
    navigation: 'MyProfile',
    icon: IMAGES.Profile,
  },
  {
    id: 2,
    title: 'Home',
    navigation: 'HomeScreen',
    icon: IMAGES.Home,
  },
  {
    id: 3,
    title: 'Notifications',
    navigation: '',
    icon: IMAGES.Notification,
  },
  {
    id: 4,
    title: 'Feedback',
    navigation: 'FeedBackScreen',
    icon: IMAGES.Feedback,
  },
  {
    id: 5,
    title: 'Help',
    navigation: 'HelpScreen',
    icon: IMAGES.Call,
  },
  {
    id: 6,
    title: 'About Us',
    navigation: '',
    icon: IMAGES.AboutUs,
  },
  {
    id: 7,
    title: 'Privacy & Terms',
    navigation: '',
    icon: IMAGES.Privacy,
  },
  {
    id: 8,
    title: 'About App',
    navigation: '',
    icon: IMAGES.AboutApp,
  },
];

const SidebarOptionsForVendor = [
  {
    id: 1,
    title: 'My Profile',
    navigation: 'MyProfile',
    icon: IMAGES.Profile,
  },
  {
    id: 2,
    title: 'Home',
    navigation: 'VendorHomeScreen',
    icon: IMAGES.Home,
  },
  {
    id: 3,
    title: 'Notifications',
    navigation: '',
    icon: IMAGES.Notification,
  },
  {
    id: 4,
    title: 'Feedback',
    navigation: 'FeedBackScreen',
    icon: IMAGES.Feedback,
  },
  {
    id: 5,
    title: 'Help',
    navigation: 'HelpScreen',
    icon: IMAGES.Call,
  },
  {
    id: 6,
    title: 'About Us',
    navigation: '',
    icon: IMAGES.AboutUs,
  },
  {
    id: 7,
    title: 'Privacy & Terms',
    navigation: '',
    icon: IMAGES.Privacy,
  },
  {
    id: 8,
    title: 'About App',
    navigation: '',
    icon: IMAGES.AboutApp,
  },
];

const CustomSidebar = props => {
  const navigation = useNavigation();
  const [modalVisible, setmodalVisible] = useState(false);
  const {hamburgerVisible, onClose} = props;
  const [userType, setUserType] = useState('');
  useEffect(() => {
    userDetails();
  }, []);

  const userDetails = async () => {
    let userType = await StorageService.getItem(
      StorageService.STORAGE_KEYS.USER_TYPE,
    );
    setUserType(userType);
  };

  const logoutUser = async () => {
    try {
      await StorageService.clear();
    } catch (err) {
      console.log(err);
    }
    navigation.replace('LoginScreen');
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          onClose(),
            item.navigation ? navigation.navigate(item.navigation) : null;
        }}>
        <Image style={styles.icon} source={item.icon} />
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal animationType="none" transparent visible={hamburgerVisible}>
      <TouchableOpacity
        style={styles.Modal}
        activeOpacity={1}
        onPress={() => {
          onClose();
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.main}>
            <View style={styles.Header}>
              <Image source={IMAGES.LogoText} style={styles.Logo} />
            </View>
            <View style={styles.allView}>
              <View style={{flex: 1}}>
                <FlatList
                  data={
                    userType == 'VENDOR'
                      ? SidebarOptionsForVendor
                      : SidebarOptionsForUser
                  }
                  renderItem={renderItem}
                  keyExtractor={item => item.id.toString()}
                  style={{flexGrow: 1}}
                  contentContainerStyle={{
                    paddingVertical: scale(20),
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    Version :
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    {DeviceInfo.getVersion()
                      ? DeviceInfo.getVersion()
                      : '1.0.0'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setmodalVisible(true);
                  }}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
      <LogoutModal
        title={
          'This action will delete all data stored in the device and cannot be retrieved.'
        }
        description={'Are you sure you want to '}
        modalVisible={modalVisible}
        onCancel={() => {
          setmodalVisible(false);
          onClose();
        }}
        onYes={() => {
          setmodalVisible(false);
          onClose();
          logoutUser();
        }}
      />
    </Modal>
  );
};

export default CustomSidebar;

const styles = StyleSheet.create({
  itemText: {
    fontSize: scale(16),
    fontFamily: Fonts.semibold,
    color: Color.main,
    paddingLeft: scale(10),
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: scale(16),
    paddingHorizontal: scale(30),
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.lightGrey,
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.main,
  },
  Modal: {
    flex: 1,
    backgroundColor: Color.modalBG,
  },
  main: {
    backgroundColor: Color.white,
    width: '78%',
    height: '100%',
  },
  allView: {
    backgroundColor: Color.white,
    justifyContent: 'space-between',
    flex: 1,
  },
  Header: {
    height: '14%',
    backgroundColor: Color.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Logo: {
    width: scale(110),
    height: scale(50),
    resizeMode: 'contain',
    tintColor: Color.background,
  },
  headingText: {
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    color: Color.textBlack,
  },
  button: {
    backgroundColor: Color.main,
    borderRadius: scale(100),
    padding: scale(10),
    paddingBottom: scale(10),
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginBottom: scale(20),
    marginTop: scale(15),
  },
  buttonText: {
    fontSize: scale(16),
    fontFamily: Fonts.semibold,
    color: Color.white,
    textAlign: 'center',
  },
  SupportView: {
    paddingHorizontal: scale(10),
    paddingTop: scale(28),
  },
  View1: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 30,
    justifyContent: 'space-between',
  },
  TextForVideo: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  TextForArrow: {
    fontSize: scale(15),
    fontFamily: Fonts.bold,
    right: 5,
  },
  TextForLink: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
  View2: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 25,
    justifyContent: 'space-between',
  },
  TextFor: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  Text1: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
  View1: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 30,
    justifyContent: 'space-between',
  },
  TextForVideo: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  TextForArrow: {
    fontSize: scale(15),
    fontFamily: Fonts.bold,
    right: 5,
  },
  TextForLink: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
  View2: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 25,
    justifyContent: 'space-between',
  },
  TextFor: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  Text1: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
});
