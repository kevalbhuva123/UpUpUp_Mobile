import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Venues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Fonts from '../../Constants/Fonts';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';

const BookVenueScreen = ({navigation}) => {
  const buttonRef = useRef();
  const [venues, setVenues] = useState([]);
  const [sports, setsports] = useState(1);
  const [area, setarea] = useState(1);
  const [Loader, setLoader] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [searchVenue, setSearchVenue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [sports, area]);

  useEffect(() => {
    if (searchVenue == '') {
      setFilteredData(venues);
    } else {
      const newFilteredData = venues.filter(item =>
        item.venue.toLowerCase().includes(searchVenue.toLowerCase()),
      );
      setFilteredData(newFilteredData);
    }
  }, [searchVenue, venues]);

  const fetchVenues = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('venue_id', '');
      formdata.append('sports', sports);
      formdata.append('area', area);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Venue/index`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false);
          if (data.ErrorCode === 0) {
            setVenues(data.Data);
            setFilteredData(data.Data);
            console.log('succuss', data.Data[0].venue_image[0]);
          } else {
            console.error('Failed to fetch venues:', data.message);
          }
        })
        .catch(error => {
          setLoader(false), console.error('Error fetching venues:', error);
        });
    } catch (error) {
      console.error('Error fetching venues:', error);
      setLoader(false);
    }
  };

  const renderImageItem = ({item}) => (
    <View style={styles.roundBorder}>
      <Image style={styles.image} source={{uri: item?.image}} />
    </View>
  );

  const renderRemainingCount = item => {
    const remainingCount = item.length - 4;
    if (remainingCount > 0) {
      return <Text style={styles.subText}>{`+${remainingCount} more`}</Text>;
    }
    return null;
  };

  const renderVenues = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('VenueDetailScreen', {data: item});
        }}>
        <Image
          source={
            item?.venue_image[0] ? {uri: item.venue_image[0]} : IMAGES.NoImage
          }
          style={styles.venueImage}
        />

        <View style={styles.titleView}>
          <Text style={[styles.heading, {width: '80%'}]} numberOfLines={1}>
            {item.venue}
          </Text>
          <View style={styles.titleLeft}>
            <Image source={IMAGES.Star} style={styles.star} />
            <Text style={styles.heading}>{item?.rating}</Text>
          </View>
        </View>
        <View style={styles.iconTextView}>
          <Image source={IMAGES.Location} style={styles.icons} />
          <Text style={styles.subText}>{item.area}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <FlatList
              data={(item?.venue_sports_2).slice(0, 4)}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
            {renderRemainingCount(item)}
          </View>
          <View style={styles.bookNow}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const Popover = ({visible, onClose, buttonRect}) => {
    if (!visible) return null;

    const {x, y, width, height} = buttonRect;

    const styles = StyleSheet.create({
      popoverContainer: {
        position: 'absolute',
        top: y + height,
        right: 20,
        backgroundColor: Color.white,
        borderRadius: 5,
        elevation: 5, // for Android elevation
        width: '30%',
      },
      button: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomColor: Color.lightGrey,
        borderBottomWidth: 0.5,
      },
      filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomColor: Color.lightGrey,
        borderBottomWidth: 0.5,
        width: '100%',
      },
      checkedIcon: {
        height: scale(16),
        width: scale(16),
        resizeMode: 'contain',
        tintColor: Color.icon,
      },
      unCheckedIcon: {
        height: scale(16),
        width: scale(16),
        resizeMode: 'contain',
        tintColor: Color.icon,
      },

      buttonText: {
        fontFamily: Fonts.bold,
        color: Color.main,
        fontSize: scale(11),
        paddingHorizontal: 10,
        paddingTop: 10,
      },
    });

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={onClose}
          activeOpacity={1} // Prevents touches from passing through
        >
          <View style={styles.popoverContainer}>
            <Text style={styles.buttonText}>Filter By</Text>
            <TouchableOpacity
              onPress={() => {
                closePopover();
                sports == 1 ? setsports(0) : setsports(1);
              }}
              style={styles.filterBtn}>
              <Image
                source={sports == 1 ? IMAGES.Checked : IMAGES.Unchecked}
                style={sports == 1 ? styles.checkedIcon : styles.unCheckedIcon}
              />
              <Text
                style={[
                  styles.heading,
                  {color: Color.icon, marginLeft: scale(5)},
                ]}>
                Sports
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closePopover();
                area == 1 ? setarea(0) : setarea(1);
              }}
              style={styles.filterBtn}>
              <Image
                source={area == 1 ? IMAGES.Checked : IMAGES.Unchecked}
                style={area == 1 ? styles.checkedIcon : styles.unCheckedIcon}
              />
              <Text
                style={[
                  styles.heading,
                  {color: Color.icon, marginLeft: scale(5)},
                ]}>
                Area
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const openPopover = () => {
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setButtonRect({x: pageX, y: pageY, width, height});
      setMoreOptionVisible(true);
    });
  };

  const closePopover = () => {
    setMoreOptionVisible(false);
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Book Venue'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.filterView}>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.input}
              placeholder="Search Venue..."
              value={searchVenue}
              placeholderTextColor={Color.lightGrey}
              onChangeText={text => {
                setSearchVenue(text);
              }}
            />
            <Image source={IMAGES.Search} style={styles.checkedIcon} />
          </View>
          <TouchableOpacity
            ref={buttonRef}
            onPress={() => {
              openPopover();
            }}>
            <Image source={IMAGES.MoreOptions} style={styles.checkedIcon} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredData}
          renderItem={renderVenues}
          keyExtractor={(item, index) => index.toString()}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            padding: scale(10),
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ActivityLoader loading={Loader} />
      <Popover
        visible={moreOptionVisible}
        onClose={closePopover}
        buttonRect={buttonRect}
      />
    </View>
  );
};

export default BookVenueScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  input: {
    width: '90%',
    fontFamily: Fonts.regular,
    color: Color.main,
    fontSize: scale(14),
    borderRadius: scale(100),
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  textInputView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    borderRadius: scale(100),
    paddingHorizontal: scale(10),
    borderColor: Color.main,
    borderWidth: scale(1),
  },
  filterView: {
    width: '100%',
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.white,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  venueImage: {
    width: '100%',
    height: scale(120),
    resizeMode: 'cover',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  card: {
    width: '100%',
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
    marginBottom: scale(15),
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(10),
    paddingTop: scale(5),
  },
  star: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    marginRight: scale(3),
  },
  roundBorder: {
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(100),
    borderWidth: scale(0.5),
    borderColor: Color.icon,
    marginRight: scale(3),
  },
  icons: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
  titleView: {
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.green,
    padding: scale(2),
    width: '15%',
    justifyContent: 'center',
    borderRadius: scale(5),
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(10),
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  bookNow: {
    borderRadius: scale(100),
    backgroundColor: Color.main,
    alignItems: 'center',
    justifyContent: 'center',
    width: '35%',
    paddingVertical: scale(7),
  },
  image: {
    height: scale(16),
    width: scale(16),
    margin: scale(5),
    tintColor: Color.icon,
    resizeMode: 'contain',
  },
  buttonText: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(11),
  },
});
