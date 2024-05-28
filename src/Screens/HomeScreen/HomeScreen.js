import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
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
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import LinearGradient from 'react-native-linear-gradient';

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
        <View style={[styles.roundBorder, {borderColor: item?.borderColor}]}>
          <Image source={item.image} style={styles.image} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior
        isSelectionModeEnabled
        disableSelectionMode={() => backAction()}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            onHamburgerPress();
          }}>
          <Image source={IMAGES.Menu} style={styles.menu} />
        </TouchableOpacity>
        <Image
          source={IMAGES.LogoText}
          style={{width: scale(100), height: scale(30), resizeMode: 'contain'}}
        />
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            navigation.navigate('MyProfile');
          }}>
          <Image source={IMAGES.Person} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.master}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: scale(20)}}>
        <Carousel
          loop
          style={{backgroundColor: Color.background}}
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
                justifyContent: 'center',
              }}>
              <Image
                source={item.venueImage}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
          )}
        />
        <Text style={[styles.heading]} numberOfLines={1}>
          Get-Set-Go!
        </Text>
        <LinearGradient
          style={styles.gradient}
          colors={[Color.grey, Color.grey, Color.background, Color.background]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
        />
        <FlatList
          data={HomeData.slice(0, 4)}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{paddingHorizontal: scale(10)}}
          contentContainerStyle={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
        <Text style={[styles.heading]} numberOfLines={1}>
          Offers & Discounts!
        </Text>
        <LinearGradient
          style={styles.gradient}
          colors={[Color.grey, Color.grey, Color.background, Color.background]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
        />
        <FlatList
          data={HomeData.slice(4, 6)}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{paddingHorizontal: scale(10)}}
          contentContainerStyle={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
        <Text style={[styles.heading]} numberOfLines={1}>
          UPcoins & Rewards!
        </Text>
        <LinearGradient
          style={styles.gradient}
          colors={[Color.grey, Color.grey, Color.background, Color.background]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
        />
        <FlatList
          data={HomeData.slice(6, 8)}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{paddingHorizontal: scale(10)}}
          contentContainerStyle={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
        <Text style={[styles.heading]} numberOfLines={1}>
          It's all about me!
        </Text>
        <LinearGradient
          style={styles.gradient}
          colors={[Color.grey, Color.grey, Color.background, Color.background]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
        />
        <FlatList
          data={HomeData.slice(8, 12)}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{paddingHorizontal: scale(10)}}
          contentContainerStyle={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
        <Text style={[styles.heading]} numberOfLines={1}>
          Track Records!
        </Text>
        <LinearGradient
          style={styles.gradient}
          colors={[Color.grey, Color.grey, Color.background, Color.background]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
        />
        <FlatList
          data={HomeData.slice(12, 14)}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{paddingHorizontal: scale(10)}}
          contentContainerStyle={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
        <Text style={[styles.heading]} numberOfLines={1}>
          We hear you!
        </Text>
        <LinearGradient
          style={styles.gradient}
          colors={[Color.grey, Color.grey, Color.background, Color.background]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
        />
        <FlatList
          data={HomeData.slice(14, 15)}
          renderItem={renderHomes}
          keyExtractor={item => item.id.toString()}
          style={{paddingHorizontal: scale(10)}}
          contentContainerStyle={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
      </ScrollView>
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
  gradient: {
    height: scale(2),
    width: '100%',
    marginHorizontal: scale(15),
    marginTop: scale(5),
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
    // backgroundColor: Color.white,
    // elevation: 6,
    // borderRadius: scale(10),
    width: '21%',
    height: scale(80),
    marginHorizontal: '1.5%',
    marginVertical: scale(10),
    paddingVertical: scale(10),
  },
  image: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.black,
  },
  title: {
    fontFamily: Fonts.semibold,
    color: Color.black,
    fontSize: scale(8),
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
    borderColor: Color.white,
    borderWidth: scale(1),
  },
  detailContainer: {
    paddingVertical: scale(10),
  },
  editBtn: {
    height: scale(35),
    width: scale(35),
  },
  heading: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    marginTop: scale(15),
    paddingHorizontal: scale(15),
    width: '100%',
  },
  roundBorder: {
    borderRadius: scale(10000),
    borderWidth: scale(2),
    height: scale(40),
    width: scale(40),
    padding: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
