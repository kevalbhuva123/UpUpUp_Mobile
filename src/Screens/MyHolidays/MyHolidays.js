import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {Dropdown} from 'react-native-element-dropdown';
import {HolidaysList, ownerVenues} from '../../Constants/StaticData';
import IMAGES from '../../Assets/Icons/index';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityLoader} from '../../Components/Loader/Loader';
import AlertModal from '../../Components/AlertModal';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';

const MyHolidays = ({navigation}) => {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [venueList, setVenueList] = useState([]);
  const [holidayList, setHolidayList] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [warning, setWarning] = useState('');

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
          holidayListById(result?.Data[0]?.id);
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

  const holidayListById = id => {
    try {
      setLoader(true);

      const formdata = new FormData();
      formdata.append('venue_id', id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Holiday/holidayslist`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);

          console.log('>>>>RESULT OFFER>>>>', result);
          setHolidayList(result?.data);
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      setLoader(false);

      console.log('Error::', error);
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

  const renderHolidays = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.date}>Date: {item.date}</Text>

      <Text style={styles.venueName}>Reason: {item.description}</Text>
    </View>
  );
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Holidays'}
        onBackPress={() => navigation.goBack()}
      />
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
            holidayListById(item?.id);
            setSelectedVenue(item);
          }}
          renderItem={renderVenues}
        />
        <Text style={styles.title}>Upcoming Holidays</Text>
        <FlatList
          data={holidayList}
          renderItem={renderHolidays}
          ListEmptyComponent={EmptyComponent}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            navigation.navigate('AddHoliday');
          }}>
          <Image source={IMAGES.Add} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <ActivityLoader loading={Loader} />
      <AlertModal
        modalVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        content={alertMessage}
      />
    </View>
  );
};

export default MyHolidays;

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
  date: {
    fontFamily: Fonts.semibold,
    color: Color.black,
    fontSize: scale(12),
  },
  venueName: {
    fontFamily: Fonts.semibold,
    color: Color.black,
    fontSize: scale(12),
    marginVertical: scale(5),
  },
  reasonText: {
    fontFamily: Fonts.regular,
    color: Color.black,
    fontSize: scale(12),
  },

  dropdown: {
    marginTop: scale(10),
    marginBottom: scale(20),
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
  itemContainer: {
    padding: 20,
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
    backgroundColor: Color.white,
    marginTop: scale(15),

    borderRadius: scale(10),
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
    marginTop: scale(100),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
  },
});
