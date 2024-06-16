import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import {Dropdown} from 'react-native-element-dropdown';
import StorageService from '../../utlis/StorageService';
import AlertModal from '../../Components/AlertModal';

const MyAreaScreen = ({navigation}) => {
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    try {
      setLoader(true);

      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Place/region`, requestOptions)
        .then(response => response.json())
        .then(async data => {
          console.log(data);
          setLocationList(data?.Data);
          setSelectedLocation(userData?.location);
          getAreaList(userData?.location);

          const formdata = new FormData();
          formdata.append('user_id', userData?.id);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Area/get_user_area`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              setLoader(false);
              const ids = result?.Data?.map(area => area.id);
              console.log('>>>>>>>>>>IDS>>>', ids);
              setSelectedOptions(ids);

              console.log(result);
            })
            .catch(error => {
              setLoader(false);

              console.error(error);
            });
        })
        .catch(error => {
          setLoader(false);

          console.error('Error fetching data:', error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const getAreaList = id => {
    try {
      setLoader(true);

      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Place/area/${id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(data => {
          setLoader(false);
          console.log(data);
          setOptions(data?.Data);
        })
        .catch(error => {
          setLoader(false);

          console.error('Error fetching data:', error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const updateLocation = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('area', JSON.stringify(selectedOptions));

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Area/edit_user_area`,
        requestOptions,
      )
        .then(response => response.json())
        .then(async result => {
          console.log('AREA>>>>>>>>>>>>>>>>>>>>>>>', result);
          if (result?.ErrorCode == 0) {
            let formData = new FormData();
            formData.append('phone_no', userData?.phone_no);

            fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Login/index`, {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
              .then(response => response.json())
              .then(async data => {
                await StorageService.saveItem(
                  StorageService.STORAGE_KEYS.USER_DETAILS,
                  data?.Data,
                );
                setAlertMsg('Areas Updated Successfully.');
                setAlertVisible(true);
              })
              .catch(error => {
                // Handle error
                setLoader(false); // Hide ActivityLoader
              });
          }
        })
        .catch(error => {
          setLoader(false);
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedOptions?.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.optionItem]}
        onPress={() =>
          setSelectedOptions(prevSelectedItems => {
            if (prevSelectedItems.includes(item?.id)) {
              return prevSelectedItems.filter(itemId => itemId !== item?.id);
            } else {
              if (prevSelectedItems.length < 4) {
                return [...prevSelectedItems, item?.id];
              } else {
                return prevSelectedItems;
              }
            }
          })
        }>
        <Text style={styles.optionLabel}>{item.area}</Text>
        <Image
          source={isSelected ? IMAGES.Checked : IMAGES.Unchecked}
          style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderLocations = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.location}</Text>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Areas'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Text style={styles.headingText}>Choose Area/Place</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          selectedTextProps={{numberOfLines: 1}}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={locationList}
          search
          maxHeight={scale(300)}
          labelField="location"
          valueField="id"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={selectedLocation}
          onChange={item => {
            console.log('>>>>>>>', item);
            setSelectedLocation(item?.id);
            setSelectedOptions([]);
            getAreaList(item?.id);
          }}
          renderItem={renderLocations}
        />
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={{flex: 1}}
          contentContainerStyle={{paddingTop: scale(20)}}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          onPress={() => {
            updateLocation();
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>UPDATE</Text>
        </TouchableOpacity>
      </View>
      <ActivityLoader loading={Loader} />
      <AlertModal
        modalVisible={alertVisible}
        onClose={async () => {
          setAlertVisible(false);
          navigation.goBack();
        }}
        content={alertMsg}
      />
    </View>
  );
};

export default MyAreaScreen;

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
  optionItem: {
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: scale(0.5),
    borderBlockColor: Color.lightGrey,
  },

  optionLabel: {
    fontSize: scale(14),
    color: Color.black,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginTop: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 2,
  },
  headingText: {
    fontSize: scale(16),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  checkedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
  },
});
