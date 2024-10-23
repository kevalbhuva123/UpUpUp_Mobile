import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Dropdown} from 'react-native-element-dropdown';
import IMAGES from '../../Assets/Icons/index';
import {Regions, Sports, ownerVenues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import DatePicker from 'react-native-date-picker';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import StorageService from '../../utlis/StorageService';
import {ActivityLoader} from '../../Components/Loader/Loader';

const MyBookingVendor = ({navigation}) => {
  const [venueList, setVenueList] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState('');

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isFromSDate, setIsFromSDate] = useState(false);
  const [isFromEDate, setIsFromEDate] = useState(false);
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    getVenueList();
  }, []);

  useEffect(() => {
    getBookingList();
  }, [startDate, endDate, selectedVenue]);

  const getVenueList = async () => {
    try {
      setLoader(true);
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
          setVenueList(result?.Data);
          setSelectedVenue(result?.Data[0]);
          getBookingList();
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.log('Error::', error);
      setLoader(false);
    }
  };

  const getBookingList = () => {
    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append('venue_id', selectedVenue?.id);
      formdata.append('start_date', moment(startDate).format('YYYY-MM-DD'));
      formdata.append('end_date', moment(endDate).format('YYYY-MM-DD'));

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Venue/my_booking_list`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          // setBookingList([
          //   {
          //     venue_booking_id: '1182',
          //     venue_id: '747',
          //     booking_id: '1722423079',
          //     sports_id: '116',
          //     user_id: '2303',
          //     court_id: '323',
          //     date: '2024-07-31',
          //     payment_id: 'vendor',
          //     status: '0',
          //     venue: 'February 11th 2020 test venue',
          //     court: 'Wooden Court 1',
          //     sports: 'Badminton',
          //     sports_image:
          //       'https://upupup.in/partnerup/pics/icons/badminton.png',
          //     name: 'MB',
          //   },
          //   {
          //     venue_booking_id: '1181',
          //     venue_id: '747',
          //     booking_id: '1722333870',
          //     sports_id: '116',
          //     user_id: '2303',
          //     court_id: '324',
          //     date: '2024-07-30',
          //     payment_id: 'pay_OenGAcFU7AdilE',
          //     status: '1',
          //     venue: 'February 11th 2020 test venue',
          //     court: 'Pool 1',
          //     sports: 'Badminton',
          //     sports_image:
          //       'https://upupup.in/partnerup/pics/icons/badminton.png',
          //     name: 'MB',
          //   },
          // ]);
          setBookingList(result?.Data);
          console.log('BOOKING>>>>>>>>>>', result);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.log('Error::', error);
      setLoader(false);
    }
  };

  const renderVenues = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.value}</Text>
      </View>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  const renderBookings = ({item}) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconView}>
          <Image
            source={
              item?.sports_image != ''
                ? {uri: item?.sports_image}
                : IMAGES.LogoText
            }
            style={styles.sportIcon}
          />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.heading} numberOfLines={2}>
            {item?.venue}
          </Text>
          <Text style={styles.subText}>Booked by: {item?.name}</Text>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Certificate} style={styles.icons} />
            <Text style={styles.subText}>Book # {item?.booking_id}</Text>
          </View>
          <View style={styles.iconTextView}>
            <Image source={IMAGES.Location} style={styles.icons} />
            <Text style={styles.subText}>{item?.court}</Text>
          </View>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.dateView}>
          <Text style={[styles.subText, {color: Color.icon}]}>
            {moment(item?.date).format('MMMM')}
          </Text>
          <Text style={[styles.heading, {color: Color.main}]}>
            {moment(item?.date).format('DD')}
          </Text>
          <Text style={styles.subText}>{moment(item?.date).year()}</Text>
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
        <View style={styles.subView}>
          <Text style={styles.heading}>Choose a Venue</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            selectedTextProps={{numberOfLines: 1}}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={venueList}
            search
            maxHeight={scale(300)}
            labelField="venue"
            valueField="id"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={selectedVenue?.id}
            onChange={item => {
              console.log('>>>>>>>', item);
              setSelectedVenue(item);
            }}
            renderItem={renderVenues}
          />
        </View>
        <View style={styles.subView}>
          <Text style={styles.title}>Choose Time Period</Text>
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: scale(5),
              },
            ]}>
            <View style={styles.halfView}>
              <Text style={styles.value}>From:</Text>
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
            <View style={styles.halfView}>
              <Text style={styles.value}>To:</Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => {
                  setIsFromEDate(true);
                  setIsDateOpen(true);
                }}>
                <Text style={styles.value}>
                  {moment(endDate).format('MM-DD-YYYY')}
                </Text>
                <Image source={IMAGES.Down} style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Text style={[styles.heading, {paddingHorizontal: scale(20)}]}>
        Booking History:
      </Text>
      <FlatList
        data={bookingList}
        renderItem={renderBookings}
        keyExtractor={item => item.booking_id.toString()}
        style={{flex: 1}}
        contentContainerStyle={{
          paddingTop: scale(10),
          paddingHorizontal: scale(20),
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyComponent}
      />
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
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default MyBookingVendor;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    backgroundColor: Color.background,
    paddingTop: scale(20),
    paddingHorizontal: scale(20),
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: scale(150),
    height: scale(150),
    resizeMode: 'contain',
    marginTop: scale(50),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
    marginBottom: scale(20),
  },
  subView: {
    width: '100%',
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(2),

    elevation: 6,
    borderRadius: scale(10),
    padding: scale(10),
    marginBottom: scale(15),
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.black,
    marginBottom: scale(5),
  },

  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.subBg,
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
  mainBox: {
    width: '100%',
    elevation: 6,
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
  halfView: {
    width: '49%',
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
  value: {
    fontFamily: Fonts.semibold,
    fontSize: scale(12),
    color: Color.black,
  },
  title: {
    fontSize: scale(14),
    color: Color.main,
    fontFamily: Fonts.semibold,
  },
});
