import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import {ActivityLoader} from '../../Components/Loader/Loader';
import StorageService from '../../utlis/StorageService';
import apiConfigs from '../../api/apiconfig';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';

const HostMatchScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [Loader, setLoader] = useState(false);
  const [hostedMatchList, setHostedMatchList] = useState();
  const [moreDetails, setMoreDetails] = useState();
  const [areaList, setAreaList] = useState();
  const [selectedArea, setSelectedArea] = useState();
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState();
  const [noOfPlayer, setNoOfPlayer] = useState();
  const [userSports, setUserSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [warning, setWarning] = useState('');
  const [matchName, setMatchName] = useState('');
  const [MatchTime, setMatchTime] = useState([]);

  useEffect(() => {
    getMyHostedMatches();
    getCurrentTimeInfo();
  }, []);

  useEffect(() => {
    getCurrentTimeInfo();
  }, [startDate]);

  const getCurrentTimeInfo = () => {
    const morningStart = new Date();
    morningStart.setHours(6, 0, 0); // 06:00 AM

    const afternoonStart = new Date();
    afternoonStart.setHours(12, 0, 0); // 12:00 PM

    const eveningStart = new Date();
    eveningStart.setHours(18, 0, 0); // 06:00 PM

    const nightStart = new Date();
    nightStart.setHours(22, 0, 0); // 10:00 PM

    // Get the current time
    const now = startDate;

    // Check if the current time has passed the morning time
    if (now >= morningStart && now < afternoonStart) {
      setMatchTime([
        {
          title: 'Afternoon',
          id: 'Afternoon',
        },
        {
          title: 'Evening',
          id: 'Evening',
        },
        {
          title: 'Night',
          id: 'Night',
        },
      ]);
    } else if (now >= afternoonStart && now < eveningStart) {
      setMatchTime([
        {
          title: 'Evening',
          id: 'Evening',
        },
        {
          title: 'Night',
          id: 'Night',
        },
      ]);
    } else if (now >= eveningStart && now < nightStart) {
      setMatchTime([
        {
          title: 'Night',
          id: 'Night',
        },
      ]);
    } else if (now >= nightStart && now < morningStart) {
      setMatchTime([]);
    } else {
      setMatchTime([
        {
          title: 'Morning',
          id: 'Morning',
        },
        {
          title: 'Afternoon',
          id: 'Afternoon',
        },
        {
          title: 'Evening',
          id: 'Evening',
        },
        {
          title: 'Night',
          id: 'Night',
        },
      ]);
    }
  };
  const getMyHostedMatches = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/index/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setHostedMatchList(result?.Data);

          const requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Sports/get_user_sports/${userData?.id}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              setUserSports(result?.Data);
              const formData = new FormData();
              formData.append('user_id', userData?.id);

              const requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow',
              };

              fetch(
                `${apiConfigs.LOCAL_SERVER_API_URL}/Area/get_user_area`,
                requestOptions,
              )
                .then(response => response.json())
                .then(result => {
                  setLoader(false);
                  setAreaList(result?.Data);
                  console.log(result);
                })
                .catch(error => {
                  setLoader(false);
                  console.error(error);
                });

              console.log(result);
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
      console.error('Error fetching venues:', error);
      setLoader(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('MatchDetailScreen', {id: item?.id});
        }}>
        <View style={styles.iconView}>
          <Image source={{uri: item?.sports_image}} style={styles.sportIcon1} />
        </View>
        <View style={{width: '70%'}}>
          <View style={styles.subView1}>
            <View style={styles.contentView}>
              <Text style={[styles.heading, {width: '80%'}]} numberOfLines={1}>
                {item?.match_name?.toUpperCase()}
              </Text>
              <Text style={[styles.subText, {width: '80%'}]} numberOfLines={1}>
                Posted by: {item.hostedBy}
              </Text>

              <View style={styles.iconTextView}>
                <Image source={IMAGES.Location} style={styles.icons} />
                <Text style={styles.subText}>{item.area}</Text>
              </View>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.dateView}>
              <Text style={[styles.subText, {color: Color.icon}]}>
                {moment(item.date).format('MMM').toUpperCase()}
              </Text>
              <Text style={[styles.heading, {color: Color.main}]}>
                {moment(item.date).format('DD')}
              </Text>
              <Text style={styles.subText}>
                {moment(item.date).format('YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.subView2}>
            <Text
              style={[
                styles.statusView,
                {
                  backgroundColor:
                    item.status == 'Request'
                      ? Color.icon
                      : item.status == 'Accept'
                      ? Color.green
                      : item.status == 'Pending'
                      ? Color.yellow
                      : Color.main,
                  color: Color.white,
                },
              ]}>
              {item.status}
            </Text>
            <View style={styles.timeView}>
              <Image
                source={IMAGES.Morning}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Morning' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Afternoon}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Afternoon' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Evening}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      item.time == 'Evening' ? Color.icon : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Night}
                style={[
                  styles.icons,
                  {tintColor: item.time == 'Night' ? Color.icon : Color.black},
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const hostMatch = async () => {
    if (!matchName.trim()) {
      setWarning('Please enter match name.');
      WarningMessageTimer();
      console.log('2');

      return;
    }

    if (!selectedSports.trim()) {
      setWarning('Please select sport.');
      WarningMessageTimer();
      console.log('2');

      return;
    }

    if (!selectedArea?.id.trim()) {
      setWarning('Please select area.');
      WarningMessageTimer();
      console.log('2');

      return;
    }

    if (!startTime.trim()) {
      setWarning('Please select match time.');
      WarningMessageTimer();
      console.log('2');

      return;
    }

    if (!moreDetails.trim()) {
      setWarning('Please enter more details.');
      WarningMessageTimer();
      console.log('2');

      return;
    }

    try {
      setLoader(true);

      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('sports_id', selectedSports);
      formdata.append('area_id', selectedArea?.id);
      formdata.append('date', moment(startDate).format('YYYY-MM-DD'));
      formdata.append('no_players', noOfPlayer);
      formdata.append('description', moreDetails);
      formdata.append('match_name', matchName);
      formdata.append('time', startTime);

      console.log('>>>FD>>>>>>', formdata);
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Matches/add`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          setSelectedSports([]);
          setSelectedArea();
          setStartDate(new Date());
          setStartTime();
          setNoOfPlayer();
          setMoreDetails();
          setMatchName();
          setActiveTab(1);
          getMyHostedMatches();
          console.log(result);
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const renderSports = ({item}) => {
    const isSelected = selectedSports == item.id;

    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          // setSelectedSports(prevSelectedItems => {
          //   if (prevSelectedItems.includes(item?.id)) {
          //     return prevSelectedItems.filter(itemId => itemId !== item?.id);
          //   } else {
          //     if (prevSelectedItems.length < 8) {
          //       return [...prevSelectedItems, item?.id];
          //     } else {
          //       return prevSelectedItems;
          //     }
          //   }
          // });
          setSelectedSports(item.id);
          setMatchName(item.sports);
        }}>
        <View style={styles.rawView}>
          <Image
            source={isSelected ? IMAGES.CheckedRadio : IMAGES.UncheckedRadio}
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

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  const renderAreas = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.area}</Text>
      </View>
    );
  };

  const renderTime = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Match Hosting'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View style={styles.headingView}>
          <TouchableOpacity
            style={activeTab == 1 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(1);
            }}>
            <Text style={styles.tabText}>Hosted Matches</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab == 2 ? styles.tabActiveButton : styles.tabButton}
            onPress={() => {
              setActiveTab(2);
            }}>
            <Text style={styles.tabText}>Host a Match</Text>
          </TouchableOpacity>
        </View>
        {activeTab == 1 ? (
          <FlatList
            data={hostedMatchList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={EmptyComponent}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingHorizontal: scale(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            bounces={false}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={20}
            style={{flex: 1, marginTop: scale(10)}}>
            <Text style={styles.title}>NOW LET'S{'\n'}HOST YOUR MATCHES</Text>

            <View style={styles.subView}>
              <Text style={styles.heading1}>Choose a Sport</Text>
              <FlatList
                data={userSports}
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

            <View style={styles.subView}>
              <Text style={styles.heading1}>Select Area</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                selectedTextProps={{numberOfLines: 1}}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={areaList}
                search
                maxHeight={scale(300)}
                labelField="area"
                valueField="id"
                placeholder="Select Area"
                searchPlaceholder="Search..."
                value={selectedArea?.id}
                onChange={item => {
                  console.log('>>>>>>>', item);
                  setSelectedArea(item);
                }}
                renderItem={renderAreas}
              />
            </View>

            <View style={styles.subView}>
              <Text style={styles.heading1}>Set Date</Text>
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
            <View style={styles.subView}>
              <Text style={styles.heading1}>Set Time</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                selectedTextProps={{numberOfLines: 1}}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={MatchTime}
                search
                maxHeight={scale(300)}
                labelField="title"
                valueField="id"
                placeholder="Select Time"
                searchPlaceholder="Search..."
                value={startTime}
                onChange={item => {
                  console.log('>>>>>>>', item);
                  setStartTime(item.id);
                }}
                renderItem={renderTime}
              />
            </View>
            <View style={styles.subView}>
              <Text style={styles.heading1}>No. of Players (Optional)</Text>

              <TextInput
                onChangeText={text => {
                  setNoOfPlayer(text);
                }}
                value={noOfPlayer}
                style={styles.input1}
                placeholder="Enter no of players.."
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.subView}>
              <Text style={styles.heading1}>More Details</Text>

              <TextInput
                onChangeText={text => {
                  setMoreDetails(text);
                }}
                value={moreDetails}
                style={styles.input}
                placeholder="Enter Details"
                multiline
              />
            </View>
            {warning !== '' && <Text style={styles.warning}>{warning}</Text>}

            <TouchableOpacity
              onPress={() => {
                hostMatch();
              }}
              style={styles.loginBtn}>
              <Text style={styles.btnText}>HOST MATCH</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        )}
      </View>
      <ActivityLoader loading={Loader} />
      <DatePicker
        modal
        open={isDateOpen}
        date={startDate ? startDate : new Date()}
        minimumDate={new Date()}
        onConfirm={date => {
          console.log(date);
          setIsDateOpen(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setIsDateOpen(false);
        }}
        mode="date"
        buttonColor={Color.icon}
        dividerColor={Color.icon}
      />
    </View>
  );
};

export default HostMatchScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: scale(20),
    backgroundColor: Color.background,
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
    marginTop: scale(10),
  },
  rawView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
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

  dropdown: {
    height: scale(40),
    backgroundColor: Color.white,
    borderWidth: scale(1),
    borderColor: Color.lightGrey,
    borderRadius: scale(10),
    padding: scale(10),
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
  input: {
    borderWidth: scale(1),
    borderColor: Color.lightGrey,
    borderRadius: scale(10),
    padding: scale(10),
    height: scale(150),
    backgroundColor: Color.white,
    textAlignVertical: 'top',
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
  },
  input1: {
    borderWidth: scale(1),
    borderColor: Color.lightGrey,
    borderRadius: scale(10),
    padding: scale(10),
    backgroundColor: Color.white,
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.regular,
    alignItems: 'center',
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
  heading1: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(5),
  },
  title: {
    fontSize: scale(14),
    color: Color.main,
    fontFamily: Fonts.bold,
    paddingBottom: scale(15),
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
  sportIcon1: {
    height: scale(60),
    width: scale(60),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  sportIcon: {
    height: scale(25),
    width: scale(25),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  mainBox: {
    width: '100%',
    elevation: 6,
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
  card: {
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: scale(10),
    marginBottom: scale(15),
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
    width: '70%',
    justifyContent: 'center',
    paddingTop: scale(10),
    height: scale(80),
    justifyContent: 'space-between',
  },
  dateView: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    color: Color.black,
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
    height: scale(50),
    borderWidth: scale(0.5),
    borderColor: Color.lightGrey,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '50%',
    fontSize: scale(10),
    paddingVertical: scale(3),
    fontFamily: Fonts.bold,
    marginTop: scale(3),
  },
  subView1: {width: '100%', flexDirection: 'row', alignItems: 'center'},
  subView2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
  },
  timeView: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
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
