import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {Dropdown} from 'react-native-element-dropdown';
import {Sports, ownerVenues} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import DatePicker from 'react-native-date-picker';

const AddOffer = ({navigation}) => {
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

  const renderVenues = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.value}</Text>
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
      <CustomHeader
        heading={'My Holidays'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View style={styles.master}>
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

          <Text style={styles.title}>Offer Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Offer Name"
            value={offerName}
            placeholderTextColor={Color.lightGrey}
            onChangeText={text => setOfferName(text)}
          />
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
          <Text style={styles.title}>Offer Date</Text>
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
          <Text style={styles.title}>Offer Time</Text>
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
                  setIsFromSTime(true);
                  setIsTimeOpen(true);
                }}>
                <Text style={styles.value}>
                  {JSON.stringify(startTime).substring(12, 17)}
                </Text>
                <Image source={IMAGES.Down} style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
            <View style={styles.halfView}>
              <Text style={styles.value}>To:</Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => {
                  setIsFromETime(true);
                  setIsTimeOpen(true);
                }}>
                <Text style={styles.value}>
                  {JSON.stringify(endTime).substring(12, 17)}
                </Text>
                <Image source={IMAGES.Down} style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => {}} style={styles.loginBtn}>
            <Text style={styles.btnText}>SUBMIT</Text>
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
    </View>
  );
};

export default AddOffer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    // paddingVertical: scale(20),
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    paddingTop: scale(20),
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
    resizeMode: 'contain',
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
    marginTop: scale(5),
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
