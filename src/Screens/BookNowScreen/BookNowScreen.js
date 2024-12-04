import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
import RBSheet from 'react-native-raw-bottom-sheet';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';
import LinearGradient from 'react-native-linear-gradient';
import Contacts from 'react-native-contacts';
import ConfirmationModal from '../../Components/ConfirmationModal';
import {useToast} from 'react-native-toast-notifications';

const BookNowScreen = ({navigation, route}) => {
  const toast = useToast();

  const refRBSheet = useRef();
  const refRBSheetPlayers = useRef();
  const refRBSheetContacts = useRef();

  const [venueDetails, setVenueDetails] = useState(route?.params?.data);
  const [isFromSDate, setIsFromSDate] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [Loader, setLoader] = useState(false);
  const [selectedSport, setSelectedSport] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState([]);
  const [slots, setSlots] = useState([]);
  const [redeemCode, setRedeemCode] = useState('');
  const [couponID, setCouponID] = useState('');
  const [coPlayer, setCoPlayer] = useState([]);
  const [coPlayerFromContact, setCoPlayerFromContact] = useState([]);
  const [slotTime, setSlotTime] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [selectedCourtPrice, setSelectedCourtPrice] = useState();
  const [subTotal, setSubTotal] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [coPlayerList, setCoPlayerList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [warning, setWarning] = useState('');
  const [contactList, setContactList] = useState([]);
  const [searchContact, setSearchContact] = useState('');
  const [filteredContact, setFilteredContact] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(20);
  const [filteredCoPlayer, setFilteredCoPlayer] = useState([]);
  const [listOfCourt, setListOfCourt] = useState(route?.params?.data?.court);

  useEffect(() => {
    getOfferCoupon();
    console.log('>>>>>>P DATA??????', route?.params?.data);
  }, []);

  const pickContact = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        setLoader(true);
        Contacts.getAll()
          .then(contacts => {
            // work with contacts
            console.log(contacts);
            setContactList(contacts);
            setFilteredContact(contacts.slice(0, itemsPerPage));
            refRBSheetContacts.current.open();
            setLoader(false);
          })
          .catch(e => {
            console.log(e);
            setLoader(false);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  };

  const loadMoreData = () => {
    if (loading) return; // Prevent multiple triggers
    const currentLength = filteredContact.length;
    if (currentLength < contactList.length) {
      setLoading(true);
      const moreData = contactList.slice(
        currentLength,
        currentLength + itemsPerPage,
      );
      setFilteredContact(prev => [...prev, ...moreData]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchContact.toLowerCase();
    const filtered = contactList.filter(item =>
      item.displayName.toLowerCase().includes(query),
    );
    setFilteredContact(filtered.slice(0, itemsPerPage));
  }, [searchContact, contactList]);

  const getOfferCoupon = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );

      console.log('>>>>USER DATA>>>', userData);
      let ownerDetails = {
        id: userData?.id,
        name: userData?.name,
        phone_no: userData?.phone_no,
      };
      setCoPlayer([ownerDetails]);
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Coupons/index/${userData?.id}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          setCouponList(result?.Data);

          const requestOptions = {
            method: 'GET',
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Users/co_players/${userData?.id}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              setLoader(false);
              console.log(result);
              setCoPlayerList(result?.Data);
              setFilteredCoPlayer(result?.Data);
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
  };
  const getSlotList = (vID, sID, cID, date) => {
    console.log('>>>>>', sID[0]);
    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append('venue_id', vID?.id ? vID?.id : vID);
      formdata.append('sports_id', sID[0]);
      formdata.append('court_id', cID);
      formdata.append('date', moment(date).format('YYYY-MM-DD'));

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      console.log('>>>>>FORM>>>', formdata);

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Myvenue/myslot`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          console.log(result);
          setSlots(result?.data);
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
          setSelectedSport([item?.sports_id]);
          const filteredCourts = venueDetails?.court?.filter(court =>
            court.sports.some(sport => sport.sports_id == item?.sports_id),
          );

          setListOfCourt(filteredCourts);
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
  const renderPlayers = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          if (index != 0) {
            const filteredItems = coPlayer.filter(
              items => items?.id !== item?.id,
            );
            setCoPlayer(filteredItems);
            const filteredItem = coPlayerFromContact.filter(
              items => items?.id !== item?.id,
            );
            setCoPlayerFromContact(filteredItem);
          }
        }}>
        <Image
          source={item?.profile ? {uri: item?.profile} : IMAGES.Person}
          style={styles.profileIcon}
        />
        <Text style={styles.label} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCourt = ({item}) => {
    const isSelected = selectedCourt == item?.court_id;

    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          setSelectedCourt([item?.court_id]);
          setSelectedCourtPrice(item?.cost);
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
          source={isSelected ? IMAGES.CheckedRadio : IMAGES.UncheckedRadio}
          style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
        />
      </TouchableOpacity>
    );
  };

  const calculateDiscountedAmounts = selectedSlots => {
    const totalDiscountedCost = selectedSlots?.reduce((total, slot) => {
      const discount =
        (parseInt(slot?.slot_cost) * parseInt(slot?.offer_value)) / 100; // Calculate discount
      const discountedCost = parseInt(slot.slot_cost) - discount; // Apply discount
      return parseInt(total) + parseInt(discountedCost); // Accumulate the total
    }, 0);

    // Update the total discounted cost state
    setDiscountedAmount(parseInt(totalDiscountedCost));
  };

  const renderSlots = ({item}) => {
    let isSelected = slotTime.includes(item);
    return (
      <TouchableOpacity
        style={[
          styles.slotBtn,
          {
            backgroundColor:
              item?.remaining_capacity == 0
                ? Color.background
                : isSelected
                ? item?.has_offer == true
                  ? item?.offer_type == 2
                    ? Color.subBg
                    : Color.lightSky
                  : Color.subBg
                : Color.white,
            borderColor:
              item?.has_offer == true
                ? item?.offer_type == 2
                  ? Color.icon
                  : Color.sky
                : Color.lightGrey,
          },
        ]}
        onPress={() => {
          setSlotTime(prevSelectedItems => {
            let updatedSlots;

            if (prevSelectedItems?.some(slot => slot?.id === item?.id)) {
              updatedSlots = prevSelectedItems.filter(
                slot => slot.id !== item.id,
              );
            } else {
              updatedSlots = [...prevSelectedItems, item];
            }

            calculateDiscountedAmounts(updatedSlots);

            return updatedSlots;
          });
        }}
        disabled={item?.remaining_capacity == 0 ? true : false}>
        {item?.has_offer == true && (
          <Image
            source={
              item?.offer_type == 2 ? IMAGES.HotOffer : IMAGES.NormalOffer
            }
            style={{
              height: scale(14),
              width: scale(14),
              resizeMode: 'contain',
              position: 'absolute',
              right: 0,
              top: 0,
              marginTop: -5,
            }}
          />
        )}
        <Text
          style={[
            styles.slotText,
            {
              color: item?.remaining_capacity == 0 ? Color.grey : Color.black,
            },
          ]}>
          {moment(item?.time, 'HH:mm:ss').format('hh:mm A')}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCoupons = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.coupon}
        onPress={() => {
          setRedeemCode(item?.coupon_code);
          setCouponID(item?.coupon_id);
          refRBSheet.current.close();
          if (item?.percentage == 'Yes') {
            var finalPrice =
              discountedAmount - (discountedAmount * item?.coupon_amount) / 100;
            setSubTotal(finalPrice <= 0 ? 0 : finalPrice);
          } else {
            var finalPrice = discountedAmount - item?.coupon_amount;
            setSubTotal(finalPrice <= 0 ? 0 : finalPrice);
          }
        }}>
        <View style={styles.leftCoupon}>
          <Text style={styles.verticalTxt}>Coupon</Text>
        </View>
        <LinearGradient
          angle={135}
          colors={[Color.main, Color.main, Color.icon]}
          style={styles.gradient}
          useAngle={true}>
          <Text style={styles.couponCode}>
            {item?.coupon_code} - Flat {item?.coupon_amount}
            {item?.percentage == 'Yes' ? '%' : 'Rs.'}
          </Text>
          <View style={styles.divider}></View>
          <Text
            style={[styles.subText, {color: Color.white}]}
            numberOfLines={2}>
            {item?.description}
          </Text>
          <Text
            style={[
              styles.heading,
              {
                paddingBottom: scale(0),
                color: Color.white,
                paddingTop: scale(3),
              },
            ]}>
            Valid upto: {moment(item?.valid_to).format('DD-MM-YYYY')}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderImageItem = ({item}) => (
    <View style={styles.roundBorder}>
      <Image style={styles.image} source={{uri: item?.sports_image}} />
    </View>
  );

  const renderCoPlayers = ({item}) => {
    let isSelected = coPlayer.some(items => items.id == item?.co_player_id);
    return (
      <TouchableOpacity
        style={styles.coPlayerCard}
        onPress={() => {
          if (isSelected) {
            toast.show('Player already Selected.', {
              type: 'custom_toast',
              placement: 'top',
              duration: 3000,
              offset: 30,
              animationType: 'slide-in',
              data: {
                title: 'Alert !!',
              },
            });
          } else {
            let playerDetail = {
              id: item?.co_player_id,
              name: item?.co_player,
              phone_no: item?.coplayer_phone,
              profile: item?.co_player_image,
            };
            setCoPlayer([...coPlayer, playerDetail]);
            refRBSheetPlayers.current.close();
            setSearchContact('');
          }
        }}>
        <LinearGradient
          angle={135}
          colors={[Color.main, Color.main, Color.icon]}
          style={styles.gradientCoPlayer}
          useAngle={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: scale(10),
            }}>
            <Image
              source={
                item?.co_player_image != ''
                  ? {uri: item?.co_player_image}
                  : IMAGES.Person
              }
              style={styles.profileIcon}
            />
            <View style={{paddingLeft: scale(20)}}>
              <Text style={[styles.heading, {color: Color.white}]}>
                {item?.co_player}
              </Text>
              <Text style={[styles.subText, {color: Color.white}]}>
                Phone No.: {item?.coplayer_phone}
              </Text>
            </View>
          </View>
          <FlatList
            data={item?.co_player_sports}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item?.sports.toString()}
            numColumns={8}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCoPlayersFromContacts = ({item}) => {
    let isSelected = coPlayer.some(items => items?.id == item?.rawContactId);

    return (
      <TouchableOpacity
        style={styles.coPlayerCard}
        onPress={() => {
          if (isSelected) {
            toast.show('Player already Selected.', {
              type: 'custom_toast',
              placement: 'top',
              duration: 3000,
              offset: 30,
              animationType: 'slide-in',
              data: {
                title: 'Alert !!',
              },
            });
          } else {
            let playerDetail = {
              id: item?.rawContactId,
              name: item?.displayName,
              phone_no: item?.phoneNumbers[0]?.number.trim(),
              profile: item?.thumbnailPath,
            };
            setCoPlayerFromContact([...coPlayerFromContact, playerDetail]);
            refRBSheetContacts.current.close();
            setSearchContact('');
          }
        }}>
        <LinearGradient
          angle={135}
          colors={[Color.main, Color.main, Color.icon]}
          style={styles.gradientCoPlayer}
          useAngle={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={
                item?.thumbnailPath != ''
                  ? {uri: item?.thumbnailPath}
                  : IMAGES.Person
              }
              style={[styles.profileIcon, {marginLeft: scale(10)}]}
            />
            <View style={{paddingLeft: scale(20)}}>
              <Text style={[styles.heading, {color: Color.white}]}>
                {item?.displayName}
              </Text>
              <Text style={[styles.subText, {color: Color.white}]}>
                Phone No.: {item?.phoneNumbers[0]?.number}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const WarningMessageTimer = () => {
    const timeoutId = setTimeout(() => {
      setWarning('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  };
  const validationFxn = () => {
    console.log('>>>>>', selectedCourt, selectedSport, slotTime);
    if (selectedSport.length == 0) {
      setWarning('Please choose a sport.');
      WarningMessageTimer();
      return;
    } else if (selectedCourt.length == 0) {
      setWarning('Please choose a court.');
      WarningMessageTimer();
      return;
    } else if (slotTime?.length == 0) {
      setWarning('Please choose a slot.');
      WarningMessageTimer();
      return;
    } else {
      navigation.navigate('PaymentScreen', {
        venueData: venueDetails,
        selectedDate: startDate,
        subTotal: redeemCode != '' ? subTotal : discountedAmount,
        selectedCourt: selectedCourt,
        selectedSport: selectedSport,
        slotTime: slotTime,
        selectedCoPlayer: coPlayer,
        selectedCoPlayerFromContact: coPlayerFromContact,
        selectedCoupon: couponID,
        actualAmount: slotTime.reduce((sum, slot) => sum + slot.slot_cost, 0),
      });
    }
  };

  const filterCoPlayer = text => {
    setSearchContact(text);
    const newFilteredData = coPlayerList.filter(item =>
      item?.co_player.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCoPlayer(newFilteredData);
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  // Increment number of players
  const incrementPlayers = id => {
    setSlotTime(prevSlots =>
      prevSlots.map(slot =>
        slot.id === id && slot.numberOfPlayers < slot.remaining_capacity
          ? {...slot, numberOfPlayers: slot.numberOfPlayers + 1}
          : slot,
      ),
    );
  };

  // Decrement number of players
  const decrementPlayers = id => {
    setSlotTime(prevSlots =>
      prevSlots.map(slot =>
        slot.id === id && slot.numberOfPlayers > 1
          ? {...slot, numberOfPlayers: slot.numberOfPlayers - 1}
          : slot,
      ),
    );
  };

  const renderCounters = ({item}) => {
    return (
      <View style={styles.slotContainer}>
        <Text style={styles.slotText}>
          {moment(item?.time, 'HH:mm:ss').format('hh:mm A')}
        </Text>
        <View style={styles.counter}>
          <TouchableOpacity
            onPress={() => decrementPlayers(item.id)}
            style={styles.decrementBtn}>
            <Text style={styles.slotText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.slotText}>{item.numberOfPlayers}</Text>
          <TouchableOpacity
            onPress={() => incrementPlayers(item.id)}
            style={styles.incrementBtn}>
            <Text style={styles.slotText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.slotText}>{`Max: ${item.remaining_capacity}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Book Now'}
        onBackPress={() => navigation.navigate('BookVenueScreen')}
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
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.heading, {width: '70%'}]}>
                Invite Players {coPlayer.length + coPlayerFromContact.length}{' '}
                <Text style={styles.subText}>(Tap to delete)</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectBtn}
                onPress={() => {
                  // pickContact();
                  setVisible(!visible);
                }}>
                <Text style={styles.selectTxt}>Select</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={coPlayer.concat(coPlayerFromContact)}
              renderItem={renderPlayers}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              contentContainerStyle={{
                backgroundColor: Color.white,
                width: '100%',
                borderRadius: scale(10),
              }}
            />
          </View>

          {listOfCourt?.length > 0 && selectedSport.length > 0 && (
            <View style={styles.subView}>
              <Text style={styles.heading}>Choose a Court</Text>
              <FlatList
                data={listOfCourt}
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

          {slots.length > 0 &&
            selectedSport.length > 0 &&
            selectedCourt.length > 0 && (
              <View style={styles.subView}>
                <Text style={styles.heading}>Choose a Slot</Text>
                <FlatList
                  data={slots}
                  renderItem={renderSlots}
                  keyExtractor={item => item.id.toString()}
                  numColumns={3}
                  contentContainerStyle={{
                    backgroundColor: Color.white,
                    width: '100%',
                    borderRadius: scale(10),
                  }}
                />
              </View>
            )}

          {slotTime.length > 0 && (
            <View style={styles.subView}>
              <Text style={styles.heading}>Select No. of Players</Text>
              <FlatList
                data={slotTime?.sort((a, b) => a.time.localeCompare(b.time))}
                keyExtractor={item => item?.id}
                renderItem={renderCounters}
              />
            </View>
          )}
          <View style={styles.subView}>
            <Text style={styles.heading}>Redeem Coupon</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => refRBSheet.current.open()}>
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
          {slotTime.length > 0 && (
            <View style={styles.subView}>
              <Text style={styles.heading}>Payment Summary</Text>
              <Text style={styles.subText}>
                Actual Amount :{' '}
                <Text style={[styles.subText, {fontFamily: Fonts.semibold}]}>
                  Rs. {slotTime?.reduce((sum, slot) => sum + slot.slot_cost, 0)}
                </Text>
              </Text>
              <Text style={styles.subText}>
                Discounted Amount :{' '}
                <Text style={[styles.subText, {fontFamily: Fonts.semibold}]}>
                  Rs. {discountedAmount}
                </Text>
              </Text>
              <Text style={styles.subText}>
                Playing Time :{' '}
                <Text style={[styles.subText, {fontFamily: Fonts.semibold}]}>
                  {slotTime.reduce(
                    (sum, slot) => sum + parseInt(slot.court_intervel),
                    0,
                  ) / 60}{' '}
                  Hours
                </Text>
              </Text>
              {/* <Text style={styles.subText}>
                Start Time :{' '}
                <Text style={[styles.subText, {fontFamily: Fonts.semibold}]}>
                  {slotTime[0]?.time}
                </Text>
              </Text> */}

              <Text style={styles.subTotal}>
                Sub Total :{' '}
                <Text style={[styles.subTotal, {fontFamily: Fonts.semibold}]}>
                  {redeemCode != '' ? subTotal : discountedAmount}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      {warning !== '' && <Text style={styles.warning}>{warning}</Text>}

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => {
          validationFxn();
        }}>
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
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        customStyles={{
          container: {
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          draggableIcon: {
            backgroundColor: Color.main,
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
        height={scale(400)}
        draggable>
        <View style={styles.drawerMain}>
          <Text style={styles.rbTitle}>Select Coupon</Text>
          <FlatList
            data={couponList}
            renderItem={renderCoupons}
            keyExtractor={item => item.coupon_id.toString()}
            contentContainerStyle={{
              backgroundColor: Color.white,
              width: '100%',
            }}
            ListEmptyComponent={EmptyComponent}
          />
        </View>
      </RBSheet>
      <RBSheet
        ref={refRBSheetPlayers}
        useNativeDriver={false}
        customStyles={{
          container: {
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
            backgroundColor: Color.white,
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          draggableIcon: {
            backgroundColor: Color.main,
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
        height={scale(600)}
        draggable>
        <View style={{paddingTop: scale(10)}}>
          <Text style={[styles.rbTitle, {paddingHorizontal: scale(20)}]}>
            Select Co-Player
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Contact..."
              value={searchContact}
              placeholderTextColor={Color.lightGrey}
              onChangeText={text => {
                filterCoPlayer(text);
              }}
            />
            <Image
              source={IMAGES.Search}
              style={[styles.iconStyle, {tintColor: Color.main}]}
            />
          </View>
          <FlatList
            data={filteredCoPlayer}
            renderItem={renderCoPlayers}
            keyExtractor={item => item.co_player_id.toString()}
            contentContainerStyle={{
              backgroundColor: Color.white,
              width: '100%',
              paddingHorizontal: scale(20),
              paddingBottom: scale(200),
            }}
            ListEmptyComponent={EmptyComponent}
          />
        </View>
      </RBSheet>
      <RBSheet
        ref={refRBSheetContacts}
        useNativeDriver={false}
        customStyles={{
          container: {
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
            backgroundColor: Color.white,
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          draggableIcon: {
            backgroundColor: Color.main,
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
        height={scale(600)}
        draggable>
        <View style={{paddingTop: scale(10)}}>
          <Text style={[styles.rbTitle, {paddingHorizontal: scale(20)}]}>
            Select Co-Player from Contacts
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Contact..."
              value={searchContact}
              placeholderTextColor={Color.lightGrey}
              onChangeText={text => {
                setSearchContact(text);
              }}
            />
            <Image
              source={IMAGES.Search}
              style={[styles.iconStyle, {tintColor: Color.main}]}
            />
          </View>
          <FlatList
            data={filteredContact}
            renderItem={renderCoPlayersFromContacts}
            keyExtractor={item => item?.rawContactId?.toString()}
            contentContainerStyle={{
              backgroundColor: Color.white,
              width: '100%',
              paddingHorizontal: scale(20),
              paddingBottom: scale(200),
            }}
            ListEmptyComponent={EmptyComponent}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && <ActivityIndicator size={'small'} color={Color.icon} />
            }
          />
        </View>
      </RBSheet>
      <ConfirmationModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        heading={'Choose co-player from'}
        btn1={'MY CONNECTIONS'}
        btn2={'MY CONTACTS'}
        asUser={() => {
          setVisible(false);
          refRBSheetPlayers.current.open();
        }}
        asVendor={() => {
          setVisible(false);
          pickContact();
        }}
      />
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
  decrementBtn: {
    height: scale(25),
    width: scale(25),
    borderRadius: scale(2),
    backgroundColor: Color.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(5),
  },
  incrementBtn: {
    height: scale(25),
    width: scale(25),
    borderRadius: scale(2),
    backgroundColor: Color.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(5),
  },
  slotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: scale(5),
    marginVertical: scale(2),
    paddingHorizontal: scale(10),
    backgroundColor: Color.background,
    borderRadius: scale(5),
  },
  counter: {
    flexDirection: 'row',
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
    marginTop: scale(50),
    marginBottom: scale(20),
  },
  emptyText: {
    fontSize: scale(14),
    color: Color.lightGrey,
    fontFamily: Fonts.semibold,
    marginBottom: scale(20),
  },
  searchInput: {
    width: '90%',
    fontFamily: Fonts.regular,
    color: Color.main,
    fontSize: scale(14),
    borderRadius: scale(100),
  },

  textInputView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: scale(100),
    paddingHorizontal: scale(10),
    borderColor: Color.main,
    borderWidth: scale(1),
    marginHorizontal: scale(20),
    marginBottom: scale(10),
  },
  warning: {
    color: Color.red,
    textAlign: 'center',
    fontSize: scale(14),
    paddingVertical: scale(10),
  },
  divider: {
    marginVertical: scale(10),
    marginHorizontal: scale(20),
    height: scale(1),
    width: '70%',
    backgroundColor: Color.white,
  },
  couponCode: {
    fontSize: scale(20),
    fontFamily: Fonts.bold,
    color: Color.white,
  },
  coupon: {
    width: '100%',
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scale(15),
    height: scale(120),
  },
  leftCoupon: {
    width: '30%',
    backgroundColor: Color.main,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: scale(20),
    borderBottomLeftRadius: scale(20),
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: scale(10),
  },
  verticalTxt: {
    fontFamily: Fonts.bold,
    color: Color.white,
    fontSize: scale(20),
    transform: [{rotate: '-90deg'}],
  },
  gradient: {
    height: '100%',
    width: '70%',
    borderBottomLeftRadius: scale(10),
    borderTopLeftRadius: scale(10),
    alignItems: 'center',
    padding: scale(10),
    justifyContent: 'center',
  },
  gradientCoPlayer: {
    width: '100%',
    borderRadius: scale(10),
    padding: scale(10),
    justifyContent: 'center',
  },
  rbTitle: {
    fontFamily: Fonts.bold,
    fontSize: scale(18),
    color: Color.black,
    paddingBottom: scale(20),
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
  coPlayerCard: {
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
  roundBorder: {
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(100),
    borderWidth: scale(0.5),
    borderColor: Color.white,
    margin: scale(5),
  },
  image: {
    height: scale(16),
    width: scale(16),
    margin: scale(5),
    tintColor: Color.white,
    resizeMode: 'contain',
  },
  heading: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(5),
  },
  subText: {fontFamily: Fonts.regular, fontSize: scale(12), color: Color.black},
  subTotal: {
    fontFamily: Fonts.bold,
    fontSize: scale(14),
    color: Color.black,
    marginTop: scale(10),
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
  slotText: {
    fontFamily: Fonts.bold,
    fontSize: scale(12),
    color: Color.black,
  },
  slotBtn: {
    width: '31%',
    marginVertical: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
    borderWidth: scale(0.5),

    borderRadius: scale(100),
    marginHorizontal: '1%',
  },
  drawerMain: {
    paddingTop: scale(10),
    paddingHorizontal: scale(20),
  },
  profileIcon: {
    width: scale(40),
    height: scale(40),
    resizeMode: 'cover',
    borderRadius: scale(100),
  },
});
