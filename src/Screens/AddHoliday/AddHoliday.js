import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {Dropdown} from 'react-native-element-dropdown';
import {ownerVenues} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import {ActivityLoader} from '../../Components/Loader/Loader';
import AlertModal from '../../Components/AlertModal';
import {useFocusEffect} from '@react-navigation/native';

const AddHoliday = ({navigation}) => {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [reason, setReason] = useState('');
  const [selectedDays, setSelectedDays] = useState('');
  const [Loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [venueList, setVenueList] = useState([]);

  useEffect(() => {
    getVenueList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getVenueList();
    }, []),
  );

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
          setLoader(false);

          console.log('>>>>VENUE Result:::', result);
          setVenueList(result?.Data);
          setSelectedVenue(result?.Data[0]);
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

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const addHoliday = async () => {
    if (!reason.trim()) {
      setWarning('Please enter reason.');
      WarningMessageTimer();
      return;
    }
    if (!selectedDays.trim()) {
      setWarning('Please select holiday date.');
      WarningMessageTimer();
      return;
    }
    try {
      setLoader(true);
      let vendorDetails = await StorageService.getItem(
        StorageService.STORAGE_KEYS.VENDOR_DETAILS,
      );

      console.log('>>>Vendor Details>>>', vendorDetails);

      const holiday = [
        {
          user_id: vendorDetails?.user_id,
          venue_id: selectedVenue?.id,
          date: selectedDays,
          description: reason,
        },
      ];
      const formdata = new FormData();
      formdata.append('holiday', JSON.stringify(holiday));
      formdata.append('count', '1');
      formdata.append('vendor_phone', vendorDetails?.phone);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Holiday/holidays`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          console.log(result);
          if (result?.ErrorCode == 0) {
            setAlertMessage('An Offer Added Successfully.');
            setModalVisible(true);
          }
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderVenues = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.value}</Text>
      </View>
    );
  };
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
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
          <Text style={styles.title}>Choose Days</Text>
          <Calendar
            // Customize the appearance of the calendar
            style={{
              borderWidth: scale(0.5),
              borderColor: Color.lightGrey,
              height: scale(300),
              borderRadius: scale(10),
              marginVertical: scale(10),
              backgroundColor: Color.white,
            }}
            // Specify the current date
            current={moment(new Date()).format('YYYY-MM-DD')}
            minDate={moment(new Date()).format('YYYY-MM-DD')}
            // Callback that gets called when the user selects a day
            onDayPress={day => {
              console.log('selected day', day);
              setSelectedDays(day.dateString);
            }}
            theme={{
              selectedDayBackgroundColor: Color.icon,
              selectedDayTextColor: Color.background,
              todayBackgroundColor: Color.subBg,
              todayTextColor: Color.black,
              textMonthFontFamily: Fonts.semibold,
              textDayFontFamily: Fonts.regular,
            }}
            markedDates={{
              [selectedDays]: {selected: true},
            }}
          />
          <Text style={styles.title}>Reason for Holiday</Text>

          <TextInput
            multiline
            onChangeText={text => {
              setReason(text);
            }}
            value={reason}
            style={styles.input}
            placeholder="Type your reason here..."
          />
          {warning !== '' && <Text style={styles.warning}>{warning}</Text>}

          <TouchableOpacity
            onPress={() => {
              addHoliday();
            }}
            style={styles.loginBtn}>
            <Text style={styles.btnText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <ActivityLoader loading={Loader} />

      <AlertModal
        modalVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
        content={alertMessage}
      />
    </View>
  );
};

export default AddHoliday;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  title: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
  },
  dropdown: {
    marginVertical: scale(10),
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
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
    borderRadius: scale(10),
    padding: scale(10),
    height: scale(150),
    backgroundColor: Color.white,
    textAlignVertical: 'top',
    marginVertical: scale(10),
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    marginVertical: scale(10),
  },
});
