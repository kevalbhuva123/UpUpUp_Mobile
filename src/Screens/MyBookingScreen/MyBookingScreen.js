import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {UpcomingBooking} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import RatingModal from '../../Components/RatingModal';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const MyBookingScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconView}>
          <Image source={item.image} style={styles.sportIcon} />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.heading}>{item.title}</Text>
          <Text style={styles.subText}>Posted by: {item.owner}</Text>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Clock} style={styles.icons} />
            <Text style={styles.subText}>
              {item.startTime}-{item.endTime}
            </Text>
          </View>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Location} style={styles.icons} />
            <Text style={styles.subText}>{item.location}</Text>
          </View>
          <Text
            style={[
              styles.statusView,
              {
                backgroundColor:
                  item.payment == 'PAID' ? Color.icon : Color.yellow,
                color: item.payment == 'PAID' ? Color.white : Color.black,
              },
            ]}>
            {item.payment}
          </Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.dateView}>
          <Text style={[styles.subText, {color: Color.icon}]}>
            {item.month}
          </Text>
          <Text style={[styles.heading, {color: Color.main}]}>{item.date}</Text>
          <Text style={styles.subText}>{item.year}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderRate = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setVisible(true);
        }}>
        <View style={styles.iconView}>
          <Image source={item.image} style={styles.sportIcon} />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.heading}>{item.title}</Text>
          <Text style={styles.subText}>Posted by: {item.owner}</Text>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Clock} style={styles.icons} />
            <Text style={styles.subText}>
              {item.startTime}-{item.endTime}
            </Text>
          </View>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Location} style={styles.icons} />
            <Text style={styles.subText}>{item.location}</Text>
          </View>
          <Text
            style={[
              styles.statusView,
              {
                backgroundColor: Color.main,
                color: Color.white,
              },
            ]}>
            RATE NOW
          </Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.dateView}>
          <Text style={[styles.subText, {color: Color.icon}]}>
            {item.month}
          </Text>
          <Text style={[styles.heading, {color: Color.main}]}>{item.date}</Text>
          <Text style={styles.subText}>{item.year}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Bookings'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.headingView}>
          <TouchableOpacity
            style={activeTab == 1 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(1);
            }}>
            <Text style={styles.tabText}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab == 2 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(2);
            }}>
            <Text style={styles.tabText}>Rate a Venue</Text>
          </TouchableOpacity>
        </View>
        {activeTab == 1 ? (
          <FlatList
            data={UpcomingBooking}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={UpcomingBooking}
            renderItem={renderRate}
            keyExtractor={item => item.id.toString()}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <RatingModal
        isVisible={visible}
        onClose={() => {
          setVisible(false);
          setRating(0);
        }}
        rating={rating}
        setRating={rating => {
          setRating(rating);
        }}
        handleRatingSubmit={() => {
          console.log(rating);
          setVisible(false);
        }}
        buttonText={'RATE VENUE'}
      />
    </View>
  );
};

export default MyBookingScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  headingView: {
    backgroundColor: Color.white,
    paddingVertical: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(25),
  },
  tabActiveButton: {
    backgroundColor: Color.subBg,
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    borderRadius: scale(100),
  },
  tabButton: {
    borderWidth: scale(1),
    borderColor: Color.subBg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '49%',
    paddingVertical: scale(10),
    borderRadius: scale(100),
  },
  tabText: {
    fontSize: scale(13),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  card: {
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: scale(10),
    marginBottom: scale(15),
  },
  sportIcon: {
    width: scale(50),
    height: scale(50),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  icons: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  contentView: {
    width: '50%',
    justifyContent: 'center',
    paddingVertical: scale(10),
    height: scale(120),
    justifyContent: 'space-between',
  },
  dateView: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: scale(14),
    fontFamily: Fonts.semibold,
    color: Color.black,
  },
  subText: {
    fontSize: scale(12),
    fontFamily: Fonts.regular,
    color: Color.black,
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: scale(60),
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '65%',
    fontSize: scale(10),
    paddingVertical: scale(3),
    fontFamily: Fonts.bold,
    marginTop: scale(3),
  },
});
