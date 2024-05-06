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

const MyBookingVendor = ({navigation}) => {
  const [region, setRegion] = useState('');
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

  const renderVenues = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.value}</Text>
      </View>
    );
  };

  const renderItem = ({item}) =>
    item.name == 'More\nSports' ? (
      <TouchableOpacity style={styles.more}>
        <Text style={styles.moreText}>{item.name}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.items}>
        <Image source={item.image} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Bookings'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
          style={{flex: 1}}>
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
            value={region}
            onChange={item => {
              setRegion(item.value);
            }}
            renderItem={renderVenues}
          />
          <Text style={styles.title}>Choose Time Period</Text>
          <View
            style={[
              styles.sliderView,
              {flexDirection: 'row', alignItems: 'center'},
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
          <Text style={styles.title}>No Bookings</Text>
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
        {/* <DatePicker
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
        /> */}
      </View>
    </View>
  );
};

export default MyBookingVendor;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
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
    width: '50%',
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
});
