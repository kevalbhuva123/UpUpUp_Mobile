import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Dropdown} from 'react-native-element-dropdown';
import IMAGES from '../../Assets/Icons/index';
import {Regions, Sports, ownerVenues} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import DatePicker from 'react-native-date-picker';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import StorageService from '../../utlis/StorageService';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityLoader} from '../../Components/Loader/Loader';

const MyVenueVendorScreen = ({navigation}) => {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [venueList, setVenueList] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    getVenueList();
  }, []);

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
          setSelectedSport(result?.Data[0]?.venue_sports_2[0]?.sports_id);
          setSelectedCourt(result?.Data[0]?.court[0]?.court_id);
          getSlotList(
            result?.Data[0]?.id,
            result?.Data[0]?.venue_sports_2[0]?.sports_id,
            result?.Data[0]?.court[0]?.court_id,
            moment(startDate).format('DD-MM-YYYY'),
          );
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

  const getSlotList = (vID, sID, cID, date) => {
    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append('venue_id', vID?.id ? vID?.id : vID);
      formdata.append('sports_id', sID);
      formdata.append('court_id', cID);
      formdata.append('date', moment(date).format('DD-MM-YYYY'));

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      console.log('>>>>>FORM>>>', formdata);

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Myvenue/slot`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          console.log(result);
          setSlots(result);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
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
    const isSelected = selectedSport == item.sports_id;
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setSelectedSport(item?.sports_id);
          getSlotList(selectedVenue, item?.sports_id, selectedCourt, startDate);
        }}>
        <Image source={{uri: item?.image}} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.sports}
        </Text>
        <Image
          source={isSelected ? IMAGES.CheckedRadio : IMAGES.UncheckedRadio}
          style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderCourt = ({item}) => {
    const isSelected = selectedCourt == item?.court_id;

    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setSelectedCourt(item?.court_id);
          getSlotList(selectedVenue, selectedSport, item?.court_id, startDate);
        }}>
        <Text style={styles.label} numberOfLines={1}>
          {item.court}
        </Text>
        <Text
          style={[styles.label, {fontFamily: Fonts.bold}]}
          numberOfLines={1}>
          Rs.{item.cost}
        </Text>
        <Image
          source={isSelected ? IMAGES.CheckedRadio : IMAGES.UncheckedRadio}
          style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderSlots = ({item}) => {
    return (
      <TouchableOpacity style={styles.slotBtn}>
        <Text style={styles.slotText}>{item?.time}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Venue'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <ScrollView
          style={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: scale(20),
            paddingBottom: scale(200),
          }}>
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
              getSlotList(item?.id, selectedSport, selectedCourt, startDate);
            }}
            renderItem={renderVenues}
          />
          <Text style={styles.heading}>Select Date</Text>
          <View
            style={[
              styles.sliderView,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <View style={styles.halfView}>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => {
                  setIsDateOpen(true);
                }}>
                <Text style={styles.value}>
                  {startDate != ''
                    ? moment(startDate).format('DD-MM-YYYY')
                    : moment().format('DD-MM-YYYY')}
                </Text>
                <Image source={IMAGES.Down} style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.heading}>Sports</Text>
          <View style={styles.mainBox}>
            <FlatList
              data={selectedVenue?.venue_sports_2}
              renderItem={renderSports}
              keyExtractor={item => item.sports_id.toString()}
              numColumns={4}
              contentContainerStyle={{
                backgroundColor: Color.white,
                width: '100%',
                borderRadius: scale(10),
              }}
            />
          </View>
          {selectedVenue?.court?.length > 0 && (
            <>
              <Text style={styles.heading}>Courts</Text>
              <View style={styles.mainBox}>
                <FlatList
                  data={selectedVenue?.court}
                  renderItem={renderCourt}
                  keyExtractor={item => item.court_id.toString()}
                  numColumns={4}
                  contentContainerStyle={{
                    backgroundColor: Color.white,
                    width: '100%',
                    borderRadius: scale(10),
                  }}
                />
              </View>
            </>
          )}
          <Text style={styles.heading}>Slots</Text>
          <View style={styles.mainBox}>
            <FlatList
              data={slots}
              renderItem={renderSlots}
              keyExtractor={item => item.slot_id.toString()}
              numColumns={3}
              contentContainerStyle={{
                backgroundColor: Color.white,
                width: '100%',
                borderRadius: scale(10),
              }}
            />
          </View>
        </ScrollView>
        <DatePicker
          modal
          open={isDateOpen}
          date={startDate ? startDate : new Date()}
          minimumDate={new Date()}
          onConfirm={date => {
            console.log(date);
            setIsDateOpen(false);
            setStartDate(date);
            getSlotList(selectedVenue, selectedSport, selectedCourt, date);
          }}
          onCancel={() => {
            setIsDateOpen(false);
          }}
          mode="date"
          buttonColor={Color.icon}
          dividerColor={Color.icon}
        />
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default MyVenueVendorScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.black,
    marginTop: scale(20),
    marginBottom: scale(10),
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  dropdown: {
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
  mainBox2: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: scale(2),
    width: '100%',
    elevation: 6,
  },
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: Color.white,
    width: '25%',
    height: scale(85),
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
    // marginTop: scale(10),
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
  value: {
    fontFamily: Fonts.semibold,
    fontSize: scale(12),
    color: Color.black,
  },
  title: {
    fontSize: scale(14),
    color: Color.main,
    fontFamily: Fonts.semibold,
    paddingTop: scale(20),
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.subBg,
    marginTop: scale(3),
  },
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
    marginTop: scale(3),
  },
  sportIcon: {
    height: scale(40),
    width: scale(40),
    resizeMode: 'contain',
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    marginVertical: scale(10),
  },
  slotText: {
    fontFamily: Fonts.regular,
    fontSize: scale(12),
    color: Color.black,
  },
  slotBtn: {
    flex: 1,
    margin: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
    backgroundColor: Color.background,
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
    borderRadius: scale(100),
  },
});
