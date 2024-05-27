import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Color from '../../Constants/Color';
import Fonts from '../../Constants/Fonts';

const ViewProfileScreen = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ImageBackground style={styles.profileImage} source={IMAGES.Venue}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={IMAGES.Back} style={styles.icon} />
        </TouchableOpacity>
      </ImageBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: scale(15)}}>
        <View style={styles.profileView}>
          <View>
            <View>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.value}>Test1</Text>
            </View>
            <View style={{marginTop: scale(20)}}>
              <Text style={styles.title}>Work</Text>
              <Text style={styles.value}>Fitness</Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.title}>Experience</Text>
              <Text style={styles.value}>5 years</Text>
            </View>
            <View style={{marginTop: scale(20)}}>
              <Text style={styles.title}>Location</Text>
              <Text style={styles.value}>Cochin</Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.title}>Followers</Text>
              <Text style={styles.value}>100</Text>
            </View>
            <View style={{marginTop: scale(20)}}>
              <Text style={styles.title}>Age</Text>
              <Text style={styles.value}>25</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsView}>
          <View style={styles.container}>
            <Image source={IMAGES.Specialist} style={styles.subIcon} />

            <View style={{paddingLeft: scale(10)}}>
              <Text style={styles.label}>Specialists</Text>
              <Text style={styles.value}>Trainer</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: scale(20)}]}>
            <Image source={IMAGES.Availability} style={styles.subIcon} />

            <View style={{paddingLeft: scale(10)}}>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.value}>Available for Personal Training</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: scale(20)}]}>
            <Image source={IMAGES.Achievement} style={styles.subIcon} />

            <View style={{paddingLeft: scale(10)}}>
              <Text style={styles.label}>Achievement & Awards</Text>
              <Text style={styles.value}>Mr.India 2007</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: scale(20)}]}>
            <Image source={IMAGES.Certificate} style={styles.subIcon} />

            <View style={{paddingLeft: scale(10)}}>
              <Text style={styles.label}>Certifications</Text>
              <Text style={styles.value}>SAI Certificate</Text>
              <Text style={styles.value}>Runners UP 2008</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBtnView}>
        <TouchableOpacity style={styles.callBtn}>
          <Image
            source={IMAGES.Call}
            style={[styles.subIcon, {tintColor: Color.white}]}
          />
          <Text style={styles.btnTxt}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followBtn}>
          <Image
            source={IMAGES.Follow}
            style={[styles.subIcon, {tintColor: Color.white}]}
          />
          <Text style={styles.btnTxt}>Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewProfileScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Color.background,
  },
  profileImage: {
    width: '100%',
    height: scale(200),
  },
  backButton: {
    height: scale(60),
    width: scale(50),
    justifyContent: 'center',
    paddingLeft: scale(20),
  },
  btnTxt: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.white,
    paddingLeft: scale(5),
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
  subIcon: {
    height: scale(18),
    width: scale(18),
    resizeMode: 'contain',
    tintColor: Color.grey,
    marginTop: scale(1),
  },
  profileView: {
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
    width: '100%',
    padding: scale(10),
    flexDirection: 'row',
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsView: {
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
    width: '100%',
    padding: scale(10),
    borderRadius: scale(10),
    marginTop: scale(20),
  },
  title: {
    fontFamily: Fonts.regular,
    color: Color.grey,
    fontSize: scale(12),
  },
  value: {
    fontFamily: Fonts.bold,
    color: Color.main,
    fontSize: scale(14),
  },
  container: {
    flexDirection: 'row',
  },
  label: {
    fontFamily: Fonts.regular,
    color: Color.grey,
    fontSize: scale(14),
  },
  bottomBtnView: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: scale(20),
    backgroundColor: Color.white,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
  },
  callBtn: {
    backgroundColor: Color.green,
    padding: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    flexDirection: 'row',
    width: '48%',
  },
  followBtn: {
    backgroundColor: Color.icon,
    padding: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    flexDirection: 'row',
    width: '48%',
  },
});
