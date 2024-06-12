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
import {Regions, Sports} from '../../Constants/StaticData';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';

const LoginInfoScreen = ({navigation, route}) => {
  const [userID, setUserID] = useState(route?.params?.userID);
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [sportsList, setSportsList] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = () => {
    try {
      setLoader(true);

      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Place/region`, requestOptions)
        .then(response => response.json())
        .then(data => {
          // setLoader(false);
          console.log(data);
          setLocationList(data?.Data);
          setSelectedLocation(data?.Data[0]);

          const requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Sports/index`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              getAreaList(data?.Data[0]?.id);

              setLoader(false);
              console.log(result);
              setSportsList(result?.Data);
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

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const submit = () => {
    if (selectedOptions.length == 0) {
      setWarning('Please select your areas.');
      WarningMessageTimer();
      return;
    } else if (selectedSports.length == 0) {
      setWarning('Please select your sports.');
      WarningMessageTimer();
      return;
    } else {
      try {
        setLoader(true);

        const formdata = new FormData();
        formdata.append('user_id', userID);
        formdata.append('area', selectedOptions);
        const requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };
        console.log('>>>FFFFF>>>>', requestOptions);

        fetch(
          `${apiConfigs.LOCAL_SERVER_API_URL}/Area/edit_user_area`,
          requestOptions,
        )
          .then(response => response.json())
          .then(async data => {
            console.log(data);
            await StorageService.saveItem(
              StorageService.STORAGE_KEYS.USER_LOCATION,
              data?.Data,
            );
            const formdata = new FormData();
            formdata.append('user_id', userID);
            formdata.append('sports', selectedSports);

            const requestOptions = {
              method: 'POST',
              body: formdata,
              redirect: 'follow',
            };

            console.log('>>>VVVVVVV>>>>', requestOptions);

            fetch(
              `${apiConfigs.LOCAL_SERVER_API_URL}/Sports/edit_user_sports`,
              requestOptions,
            )
              .then(response => response.json())
              .then(async result => {
                console.log(result);
                setLoader(false);
                await StorageService.saveItem(
                  StorageService.STORAGE_KEYS.USER_SPORTS,
                  data?.Data,
                );
                await StorageService.saveItem(
                  StorageService.STORAGE_KEYS.USER_TYPE,
                  'USER',
                );
                navigation.replace('HomeScreen');
              })
              .catch(error => {
                setLoader(false);
                console.error(error);
              });
          })
          .catch(error => {
            setLoader(false);
            console.error(error);
          });
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedOptions.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.optionItem]}
        onPress={() => {
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
          });
        }}>
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

  const renderSports = ({item}) => {
    const isSelected = selectedSports?.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setSelectedSports(prevSelectedItems => {
            if (prevSelectedItems.includes(item?.id)) {
              return prevSelectedItems.filter(itemId => itemId !== item?.id);
            } else {
              if (prevSelectedItems.length < 8) {
                return [...prevSelectedItems, item?.id];
              } else {
                return prevSelectedItems;
              }
            }
          });
        }}>
        <View style={styles.rawView}>
          <Image
            source={isSelected ? IMAGES.Checked : IMAGES.Unchecked}
            style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
          />
        </View>
        <Image source={{uri: item.image}} style={styles.sportIcon} />
        <Text style={styles.label} numberOfLines={1}>
          {item.sports}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Login Information'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <ScrollView
          style={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: scale(20)}}>
          <Text style={styles.heading}>Select a Region</Text>
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
            value={selectedLocation?.id}
            onChange={item => {
              console.log('>>>>>>>', item);
              setSelectedLocation(item);
              setSelectedOptions([]);
              getAreaList(item?.id);
            }}
            renderItem={renderLocations}
          />

          <Text style={styles.heading}>
            Choose Area/ Place{' '}
            <Text style={styles.subText}>(Max. 4 areas)</Text>
          </Text>
          <View style={styles.subView}>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              style={{flex: 1}}
              contentContainerStyle={{borderRadius: scale(10)}}
              showsVerticalScrollIndicator={false}
              numColumns={2}
            />
          </View>
          <Text style={styles.heading}>
            Select a Sport <Text style={styles.subText}>(Max. 8 sports)</Text>
          </Text>
          <View style={styles.mainBox}>
            <FlatList
              data={sportsList}
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
        </ScrollView>
        {warning !== '' && <Text style={styles.warning}>{warning}</Text>}

        <TouchableOpacity
          onPress={() => {
            submit();
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>FINISH</Text>
        </TouchableOpacity>
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default LoginInfoScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    marginVertical: scale(10),
  },
  subText: {fontFamily: Fonts.regular, fontSize: scale(10), color: Color.black},
  rawView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
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
    marginBottom: scale(15),
  },
  area1: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
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
  unCheckedIcon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
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
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: Color.white,
    borderRadius: scale(10),
    flex: 1,
  },
  label: {
    marginTop: scale(5),
    textAlign: 'center',
    fontFamily: Fonts.regular,
    fontSize: scale(10),
    color: Color.black,
  },
  sportIcon: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
    tintColor: Color.icon,
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
  optionItem: {
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(15),
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.lightGrey,
    width: '50%',
    borderRightWidth: scale(0.5),
    borderRightColor: Color.lightGrey,
  },

  optionLabel: {
    fontSize: scale(14),
    color: Color.black,
    fontWeight: '600',
  },
});
