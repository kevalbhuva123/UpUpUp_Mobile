import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import IMAGES from '../../Assets/Icons/index';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {ActivityLoader} from '../../Components/Loader/Loader';

const BookNowScreen = ({navigation, route}) => {
  const [venueDetails, setVenueDetails] = useState(route?.params?.data);
  const [isFromSDate, setIsFromSDate] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [Loader, setLoader] = useState(false);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState([]);
  const [slots, setSlots] = useState([]);
  const [redeemCode, setRedeemCode] = useState('');
  const [coPlayer, setCoPlayer] = useState([]);
  const [coPlayerFromContact, setCoPlayerFromContact] = useState([]);

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

  const renderSports = ({item}) => {
    const isSelected = selectedSport == item.sports_id;
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setSelectedSport(item?.sports_id);
        }}>
        <Image source={{uri: item?.image}} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.sports}
        </Text>
        <Image
          source={isSelected ? IMAGES.Checked : IMAGES.Unchecked}
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
          getSlotList(
            venueDetails?.id,
            selectedSport,
            item?.court_id,
            startDate,
          );
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
          source={isSelected ? IMAGES.Checked : IMAGES.Unchecked}
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
        heading={'Book Now'}
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
          <View style={styles.subView}>
            <Text style={styles.heading}>Pick a Date</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => {
                setIsFromSDate(true);
                setIsDateOpen(true);
              }}>
              <Text style={styles.value}>
                {moment(startDate).format('dddd')},{' '}
                {moment(startDate).format('YYYY-MM-DD')}
              </Text>
              <Image source={IMAGES.Down} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <View style={styles.subView}>
            <Text style={styles.heading}>Choose a Sport</Text>
            <FlatList
              data={venueDetails?.venue_sports_2}
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

          <View style={styles.subView}>
            <Text style={styles.heading}>
              Total Players {coPlayer.length + coPlayerFromContact.length}{' '}
              <Text style={styles.subText}>(Double-tap to delete)</Text>
            </Text>
            <FlatList
              data={venueDetails?.venue_sports_2}
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

          {venueDetails?.court?.length > 0 && (
            <View style={styles.subView}>
              <Text style={styles.heading}>Choose a Court</Text>
              <FlatList
                data={venueDetails?.court}
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
          )}

          {slots.length > 0 && (
            <View style={styles.subView}>
              <Text style={styles.heading}>Choose a Slot</Text>
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
          )}
          <View style={styles.subView}>
            <Text style={styles.heading}>Redeem Coupon</Text>
            <TouchableOpacity style={styles.pickerBtn}>
              <TextInput
                onChangeText={text => {
                  setRedeemCode(text);
                }}
                value={redeemCode}
                style={styles.input}
                placeholder="Apply Offer Code"
                editable={false}
              />
              <View style={styles.selectBtn}>
                <Text style={styles.selectTxt}>Select</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity style={styles.bottomButton} onPress={() => {}}>
        <Text style={styles.buttonText}>MAKE PAYMENT</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isDateOpen}
        date={startDate}
        minimumDate={startDate}
        onConfirm={date => {
          console.log(date);
          setIsDateOpen(false);
          setStartDate(date);
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

export default BookNowScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    padding: scale(20),
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
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(5),
  },
  subText: {fontFamily: Fonts.regular, fontSize: scale(12), color: Color.black},
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
  iconStyle: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
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
    tintColor: Color.icon,
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
  selectBtn: {
    borderRadius: scale(100),
    backgroundColor: Color.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(7),
    paddingHorizontal: scale(15),
  },
  selectTxt: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(11),
  },
  input: {
    width: '70%',
    backgroundColor: Color.white,
    fontSize: scale(12),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  bottomButton: {
    backgroundColor: Color.icon,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(15),
  },
  buttonText: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(14),
  },
});
