import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import {HomeData, Venues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import CustomSidebar from '../../Components/CustomSidebar';
import Carousel from 'react-native-reanimated-carousel';

const HomeScreen = ({navigation}) => {
  const width = Dimensions.get('window').width;

  const [hamburgerVisible, sethamburgerVisible] = useState(false);

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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            onHamburgerPress();
          }}>
          <Image source={IMAGES.Menu} style={styles.menu} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            navigation.navigate('MyProfile');
          }}>
          <Image source={IMAGES.Person} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.master}>
        <Carousel
          loop
          mode="parallax"
          style={{backgroundColor: Color.main}}
          width={width}
          height={scale(200)}
          autoPlay={true}
          data={Venues}
          scrollAnimationDuration={1000}
          onSnapToItem={index => {}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: scale(0.5),
                justifyContent: 'center',
                borderRadius: scale(10),
                borderColor: Color.main,
              }}>
              <Image
                source={item.venueImage}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover',
                  borderRadius: scale(10),
                }}
              />
            </TouchableOpacity>
          )}
        />
        <FlatList
          data={HomeData}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{flex: 1, marginTop: scale(-250)}}
          contentContainerStyle={{
            paddingHorizontal: scale(10),
            paddingVertical: scale(10),
          }}
          showsVerticalScrollIndicator={false}
          numColumns={3}
        />
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

export default HomeScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    backgroundColor: Color.main,
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(10),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  master: {
    flex: 1,
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
    // paddingTop: scale(20),
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
    height: scale(30),
    width: scale(30),
    resizeMode: 'cover',
    borderRadius: scale(100),
  },
  detailContainer: {
    paddingVertical: scale(10),
  },
  editBtn: {
    height: scale(35),
    width: scale(35),
  },
});
