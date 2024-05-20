import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import {VenueHome} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import CustomSidebar from '../../Components/CustomSidebar';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import StorageService from '../../utlis/StorageService';

const VendorHomeScreen = ({navigation}) => {
  const [hamburgerVisible, sethamburgerVisible] = useState(false);
  const [vendorProfile, setVendorProfile] = useState();
  useEffect(() => {
    vendorData();
  }, []);

  const vendorData = async () => {
    let vendorDetails = await StorageService.getItem(
      StorageService.STORAGE_KEYS.VENDOR_DETAILS,
    );

    setVendorProfile(vendorDetails);
  };

  const onClose = () => {
    sethamburgerVisible(false);
  };

  const onHamburgerPress = () => {
    sethamburgerVisible(true);
  };

  const renderHomes = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(item.navigation);
        }}
        style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            onHamburgerPress();
          }}>
          <Image source={IMAGES.Menu} style={styles.menu} />
        </TouchableOpacity>
        <View style={styles.profileView}>
          <Image
            source={
              vendorProfile?.image != 0
                ? {uri: vendorProfile?.image}
                : IMAGES.Person
            }
            style={styles.profile}
          />
          <View style={styles.detailContainer}>
            <Text style={styles.lastName}>{vendorProfile?.name}</Text>
            <View style={styles.iconTextView}>
              <Image source={IMAGES.Call} style={styles.icons} />
              <Text style={styles.subText}>+91 {vendorProfile?.phone}</Text>
            </View>
            <View style={styles.iconTextView}>
              <Image
                source={IMAGES.Email}
                style={[styles.icons, {tintColor: Color.white}]}
              />
              <Text style={styles.subText}>{vendorProfile?.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigation.navigate('VendorProfileEdit');
            }}>
            <Image source={IMAGES.Pencil} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.master}>
        <FlatList
          data={VenueHome}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            paddingHorizontal: scale(10),
            paddingVertical: scale(10),
          }}
          showsVerticalScrollIndicator={false}
          numColumns={3}
        />
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.btnText}>Assign Managers</Text>
        </TouchableOpacity>
      </View>
      <CustomSidebar
        hamburgerVisible={hamburgerVisible}
        onClose={() => {
          onClose();
        }}
      />
    </View>
  );
};

export default VendorHomeScreen;

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: Color.icon,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginVertical: scale(30),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    letterSpacing: 2,
  },
  main: {
    flex: 1,
  },
  header: {
    flex: 0.4,
    backgroundColor: Color.main,
    padding: scale(20),
  },
  master: {
    flex: 0.6,
    backgroundColor: Color.background,
  },
  profileView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(60),
  },
  profile: {
    height: scale(90),
    width: scale(90),
    borderRadius: scale(10),
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    elevation: 6,
    borderRadius: scale(10),
    flex: 1,
    marginHorizontal: scale(5),
    marginVertical: scale(10),
    paddingVertical: scale(15),
  },
  image: {
    height: scale(40),
    width: scale(40),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(10),
    textAlign: 'center',
    paddingTop: scale(7),
    paddingHorizontal: scale(5),
  },
  menu: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
    tintColor: Color.white,
  },
  menuBtn: {
    height: scale(35),
    width: scale(35),
    paddingTop: scale(20),
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scale(3),
  },
  icons: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
  subText: {
    fontSize: scale(12),
    fontFamily: Fonts.regular,
    color: Color.white,
  },
  firstName: {
    fontSize: scale(18),
    fontFamily: Fonts.regular,
    color: Color.white,
  },
  lastName: {
    fontSize: scale(18),
    color: Color.white,
    fontFamily: Fonts.bold,
  },
  editIcon: {
    height: scale(20),
    width: scale(20),
    tintColor: Color.white,
    resizeMode: 'contain',
  },
  detailContainer: {
    paddingVertical: scale(10),
  },
  editBtn: {
    paddingVertical: scale(10),
    paddingLeft: scale(10),
  },
});
