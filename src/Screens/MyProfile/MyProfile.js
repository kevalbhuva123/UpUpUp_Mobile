import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {Sports} from '../../Constants/StaticData';

const MyProfile = ({navigation}) => {
  const options = [
    {id: 1, label: 'Kaloor'},
    {id: 2, label: 'Nettoor'},
    {id: 3, label: 'Kadavantra'},
    {id: 4, label: 'Palluruthy'},
    {id: 5, label: 'Ernakulam'},
    {id: 6, label: 'Fort Kochi'},
    {id: 7, label: 'Thrissur'},
  ];
  const renderItem = ({item}) =>
    item.image && (
      <TouchableOpacity style={styles.item} disabled>
        <Image source={item.image} style={styles.sportIcon} />
        <Text style={styles.label}>{item.name}</Text>
      </TouchableOpacity>
    );

  const renderLocation = ({item}) => {
    return (
      <TouchableOpacity style={[styles.optionItem]} disabled>
        <Text style={styles.optionLabel}>
          {'\u2022'} {item.label}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <CustomHeader
        heading={'My Profile'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.topView}>
          <Image source={IMAGES.Person} style={styles.profile} />
          <Text style={styles.title}>Keval Bhuva</Text>
          <Text style={styles.subTitle}>+91 9999922222</Text>
          <Text style={styles.subTitle}>keval@gmail.com</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigation.navigate('MyProfileEdit');
            }}>
            <Image source={IMAGES.Pencil} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.contentView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.box}>
            <Text style={styles.heading}>My Sports</Text>
            <FlatList
              data={Sports}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              contentContainerStyle={{
                backgroundColor: Color.white,
                marginVertical: scale(10),
              }}
            />
            <View style={styles.settingView}>
              <TouchableOpacity style={styles.settingBtn}>
                <Image
                  source={IMAGES.Setting}
                  style={[styles.icon, {tintColor: Color.black}]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.box}>
            <Text style={styles.heading}>My Locations</Text>
            <FlatList
              data={options}
              renderItem={renderLocation}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{marginVertical: scale(10)}}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.settingView}>
              <TouchableOpacity style={styles.settingBtn}>
                <Image
                  source={IMAGES.Setting}
                  style={[styles.icon, {tintColor: Color.black}]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.background,
    fontSize: scale(16),
  },
  subTitle: {
    fontFamily: Fonts.regular,
    color: Color.background,
    fontSize: scale(12),
    marginTop: scale(3),
  },
  topView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(20),
    backgroundColor: Color.main,
  },
  profile: {
    height: scale(100),
    width: scale(100),
    resizeMode: 'cover',
    borderRadius: scale(1000),
    marginBottom: scale(10),
  },
  editBtn: {
    backgroundColor: Color.icon,
    borderRadius: scale(1000),
    padding: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: scale(-18),
    right: scale(20),
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.background,
  },
  contentView: {
    padding: scale(20),
  },
  box: {
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
    padding: scale(20),
    marginTop: scale(20),
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.black,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(10),
    backgroundColor: Color.white,
  },
  sportIcon: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  label: {
    marginTop: scale(7),
    textAlign: 'center',
    fontFamily: Fonts.regular,
    color: Color.black,
    fontSize: scale(10),
  },
  settingView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingBtn: {
    width: '20%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionItem: {
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(5),
  },
  optionLabel: {
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
});
