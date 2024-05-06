import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import {Sports, ownerVenues} from '../../Constants/StaticData';
import DatePicker from 'react-native-date-picker';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const VendorMyOfferScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDays, setSelectedDays] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerPercentage, setOfferPercentage] = useState(0);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isFromSDate, setIsFromSDate] = useState(false);
  const [isFromEDate, setIsFromEDate] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isFromSTime, setIsFromSTime] = useState(false);
  const [isFromETime, setIsFromETime] = useState(false);
  const [venueList, setVenueList] = useState([]);
  const [offerList, setOfferList] = useState([]);

  useEffect(() => {
    getVenueList();
  }, []);

  const getVenueList = async () => {
    try {
      let vendorDetails = await StorageService.getItem(
        StorageService.STORAGE_KEYS.VENDOR_DETAILS,
      );

      console.log('>>>Vendor Details>>>', vendorDetails);

      const formdata = new FormData();
      formdata.append('user_id', vendorDetails?.user_id);
      formdata.append('venue_id', '');
      formdata.append('sports', 'true');
      formdata.append('area', 'true');

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Venue/index`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('>>>>VENUE Result:::', result);
          setVenueList(result.Data);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Error::', error);
    }
  };

  const offersListById = id => {
    try {
      const formdata = new FormData();
      formdata.append('venue_id', id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Offer/offerlist`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log('>>>>RESULT OFFER>>>>', result);
          setOfferList(result.Data);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Error::', error);
    }
  };

  const renderVenues = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.venue}</Text>
      </View>
    );
  };

  const renderSports = ({item}) => {
    if (item.name != 'More\nSports') {
      return (
        <TouchableOpacity style={styles.items}>
          <Image source={item.image} style={styles.sportIcon} />
          <Text style={styles.label} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Offers'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.headingView}>
          <TouchableOpacity
            style={activeTab == 1 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(1);
            }}>
            <Text style={styles.tabText}>Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab == 2 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(2);
            }}>
            <Text style={styles.tabText}>Hot Day Offer</Text>
          </TouchableOpacity>
        </View>
        {activeTab == 1 ? (
          <View style={styles.offerView}>
            <Text style={styles.title}>Choose Venue</Text>

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={venueList}
              search
              maxHeight={scale(300)}
              labelField="id"
              valueField="venue"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={selectedVenue}
              onChange={item => {
                console.log('>>>>>>>', item);
                offersListById(item?.id);
                setSelectedVenue(item.venue);
              }}
              renderItem={renderVenues}
            />
            <FlatList
              data={offerList}
              renderItem={renderOffers}
              ListEmptyComponent={EmptyComponent}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                navigation.navigate('AddOffer');
              }}>
              <Image source={IMAGES.Add} style={styles.addIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <KeyboardAwareScrollView
              contentContainerStyle={{flexGrow: 1}}
              bounces={false}
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              extraScrollHeight={20}
              style={{flex: 1}}>
              <View style={styles.offerView}>
                <Text style={styles.title}>Choose Venue</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={ownerVenues}
                  search
                  maxHeight={scale(300)}
                  labelField="key"
                  valueField="value"
                  placeholder="Select item"
                  searchPlaceholder="Search..."
                  value={selectedVenue}
                  onChange={item => {
                    console.log('>>>>>>>', item);
                    setSelectedVenue(item.value);
                  }}
                  renderItem={renderVenues}
                />

                <Text style={styles.title}>Offer Date</Text>
                <View
                  style={[
                    styles.sliderView,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <View style={styles.halfView}>
                    <TouchableOpacity
                      style={styles.pickerBtn}
                      onPress={() => {
                        setIsFromSDate(true);
                        setIsDateOpen(true);
                      }}>
                      <Text style={styles.value}>
                        {moment(startDate).format('MM-DD-YYYY')}
                      </Text>
                      <Image source={IMAGES.Down} style={styles.iconStyle} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.title}>Choose Sport</Text>
                <View style={styles.mainBox}>
                  <FlatList
                    data={Sports}
                    renderItem={renderSports}
                    keyExtractor={item => item.id.toString()}
                    numColumns={4}
                    contentContainerStyle={{
                      backgroundColor: Color.white,
                      width: '100%',
                      borderRadius: scale(10),
                    }}
                  />
                </View>
                <Text style={styles.title}>
                  Offer Percentage : {offerPercentage}%
                </Text>
                <View style={styles.sliderView}>
                  <Slider
                    style={{width: '100%', height: scale(50)}}
                    minimumValue={0}
                    maximumValue={100}
                    minimumTrackTintColor={Color.subBg}
                    maximumTrackTintColor="#000000"
                    value={offerPercentage}
                    onValueChange={value => {
                      console.log('>>>>', parseInt(value));
                      setOfferPercentage(parseInt(value));
                    }}
                    thumbTintColor={Color.icon}
                  />
                </View>
                <Text style={styles.title}>Choose Court</Text>
                <View style={styles.mainBox}>
                  <FlatList
                    data={Sports}
                    renderItem={renderSports}
                    keyExtractor={item => item.id.toString()}
                    numColumns={4}
                    contentContainerStyle={{
                      backgroundColor: Color.white,
                      width: '100%',
                      borderRadius: scale(10),
                    }}
                  />
                </View>

                <TouchableOpacity onPress={() => {}} style={styles.loginBtn}>
                  <Text style={styles.btnText}>ADD HOT OFFER</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
            <DatePicker
              modal
              open={isDateOpen}
              date={isFromSDate ? startDate : endDate}
              minimumDate={isFromEDate ? startDate : new Date()}
              onConfirm={date => {
                console.log(date);
                setIsDateOpen(false);
                isFromSDate ? setStartDate(date) : setEndDate(date);
                setIsFromEDate(false);
                setIsFromSDate(false);
              }}
              onCancel={() => {
                setIsDateOpen(false);
              }}
              mode="date"
              buttonColor={Color.icon}
              dividerColor={Color.icon}
            />
            <DatePicker
              modal
              open={isTimeOpen}
              date={isFromSTime ? startDate : endDate}
              onConfirm={time => {
                console.log(time);
                setIsTimeOpen(false);
                isFromSTime ? setStartTime(time) : setEndTime(time);
                setIsFromETime(false);
                setIsFromSTime(false);
              }}
              onCancel={() => {
                setIsTimeOpen(false);
              }}
              mode="time"
              buttonColor={Color.icon}
              dividerColor={Color.icon}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default VendorMyOfferScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: scale(20),
    backgroundColor: Color.white,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: scale(14),
    color: Color.main,
    fontFamily: Fonts.semibold,
    paddingTop: scale(20),
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
  offerView: {
    paddingHorizontal: scale(20),
    flex: 1,
  },
  dropdown: {
    marginTop: scale(10),

    height: scale(40),
    backgroundColor: Color.white,
    borderRadius: scale(10),
    padding: scale(10),
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(2),

    elevation: 6,
  },
  placeholderStyle: {
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  selectedTextStyle: {
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  iconStyle: {
    width: scale(20),
    height: scale(20),
  },
  inputSearchStyle: {
    height: scale(40),
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  item: {
    padding: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  addBtn: {
    justifyContent: 'center',
    padding: scale(15),
    alignItems: 'center',
    position: 'absolute',
    bottom: scale(40),
    right: scale(20),
    backgroundColor: Color.icon,
    borderRadius: scale(1000),
  },
  addIcon: {
    height: scale(22),
    width: scale(22),
    resizeMode: 'contain',
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontFamily: Fonts.bold,
  },

  input: {
    height: scale(40),
    width: '100%',
    borderColor: Color.lightGrey,
    borderWidth: scale(0.5),
    marginTop: scale(10),
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
  sliderView: {
    width: '100%',
    borderColor: Color.lightGrey,
    borderWidth: scale(0.5),
    marginTop: scale(10),
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
  value: {
    fontFamily: Fonts.semibold,
    fontSize: scale(12),
    color: Color.black,
  },
  halfView: {
    width: '100%',
    padding: scale(10),
  },
  pickerBtn: {
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
    padding: scale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: scale(10),
  },
  mainBox: {
    width: '100%',
    borderColor: Color.lightGrey,
    borderWidth: scale(0.5),
    marginTop: scale(10),
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
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: Color.white,
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
