import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import {scale} from '../../utlis/Scale';
import {ActivityLoader} from '../../Components/Loader/Loader';
import apiConfigs from '../../api/apiconfig';
import StorageService from '../../utlis/StorageService';
import Fonts from '../../Constants/Fonts';
import IMAGES from '../../Assets/Icons/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useToast} from 'react-native-toast-notifications';

const MatchDetailScreen = ({navigation, route}) => {
  const toast = useToast();

  const refRBSheetPlayers = useRef();

  const [Loader, setLoader] = useState(false);
  const [matchDetails, setMatchDetails] = useState();
  const [listOfRequest, setListOfRequest] = useState([]);

  useEffect(() => {
    getMatchDetails();
  }, []);

  const getMatchDetails = async () => {
    try {
      setLoader(true);
      const userData = await StorageService.getItem(
        StorageService.STORAGE_KEYS.USER_DETAILS,
      );
      const formdata = new FormData();
      formdata.append('user_id', userData?.id);
      formdata.append('match_id', route.params.id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/get_match_details`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setMatchDetails(result?.Data);
          console.log(result);

          const formdata = new FormData();
          formdata.append('user_id', userData?.id);
          formdata.append('match_id', route.params.id);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
          };

          fetch(
            `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/pending_match`,
            requestOptions,
          )
            .then(response => response.json())
            .then(data => {
              setLoader(false);
              setListOfRequest(data?.Data);
              console.log(data);
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
  };

  const responseOfRequest = async (co_player_id, status) => {
    try {
      setLoader(true);

      const formdata = new FormData();
      formdata.append('match_id', matchDetails?.match[0]?.match_id);
      formdata.append('co_player', co_player_id);
      formdata.append('status', status);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `${apiConfigs.LOCAL_SERVER_API_URL}/Matches/update_match_status`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setLoader(false);
          if (status == 2) {
            toast.show('Request accepted successfully.', {
              type: 'success',
              placement: 'top',
              duration: 3000,
              offset: 30,
              animationType: 'slide-in',
            });
          } else {
            toast.show('Request rejected.', {
              type: 'danger',
              placement: 'top',
              duration: 3000,
              offset: 30,
              animationType: 'slide-in',
            });
          }
          getMatchDetails();
          console.log(result);
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

  const renderCoPlayers = ({item}) => {
    return (
      <View
        style={[styles.subView, {flexDirection: 'row', alignItems: 'center'}]}>
        <View style={styles.imageCardView}>
          <Image
            source={item?.image ? {uri: item?.image} : IMAGES.Profile}
            style={styles.profile}
          />
        </View>
        <View style={styles.contentCardView}>
          <Text style={styles.ReqName} numberOfLines={1}>
            {item?.name.toUpperCase()}
          </Text>
          <Text style={styles.ReqPhone}>Phone: {item?.phone_no}</Text>
          <View style={styles.btnView}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => {
                responseOfRequest(item?.id, 5);
                refRBSheetPlayers.current.close();
              }}>
              <Text style={styles.subBtnText}>REJECT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => {
                responseOfRequest(item?.id, 2);
                refRBSheetPlayers.current.close();
              }}>
              <Text style={styles.subBtnText}>ACCEPT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={IMAGES.Empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Match Details'}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={20}
        style={{flex: 1}}>
        <View
          style={[
            styles.subView,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <Image
            source={{uri: matchDetails?.match[0]?.sports_image}}
            style={styles.sportIcon}
          />
          <View style={{width: '50%', paddingLeft: scale(10)}}>
            <Text style={styles.matchName}>
              {matchDetails?.match[0]?.match_name?.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.statusView,
                {
                  backgroundColor:
                    matchDetails?.status == 'Request'
                      ? Color.icon
                      : matchDetails?.status == 'Accept'
                      ? Color.green
                      : matchDetails?.status == 'Pending'
                      ? Color.yellow
                      : Color.main,
                  color: Color.white,
                },
              ]}>
              {matchDetails?.status}
            </Text>
          </View>
          <View style={styles.profileView}>
            <Image
              source={
                matchDetails?.match[0]?.user_image != ''
                  ? {uri: matchDetails?.match[0]?.user_image}
                  : IMAGES.Person
              }
              style={styles.profile}
            />
            <Text style={styles.name} numberOfLines={1}>
              {matchDetails?.match[0]?.hosted_by}
            </Text>
          </View>
        </View>
        <View style={[styles.subView]}>
          <View style={styles.iconTxtView}>
            <Image source={IMAGES.Location} style={styles.icon} />
            <Text style={styles.subText}>{matchDetails?.match[0]?.area}</Text>
          </View>
          <View style={styles.iconTxtView}>
            <Image source={IMAGES.Calendar} style={styles.icon} />
            <Text style={styles.subText}>{matchDetails?.match[0]?.date}</Text>
          </View>
          <View style={styles.timeView}>
            <View style={styles.iconTxtView}>
              <Image source={IMAGES.Clock} style={styles.icon} />
              <Text style={styles.subText}>{matchDetails?.match[0]?.time}</Text>
            </View>
            <View style={styles.timeView2}>
              <Image
                source={IMAGES.Morning}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      matchDetails?.match[0]?.time == 'Morning'
                        ? Color.icon
                        : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Afternoon}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      matchDetails?.match[0]?.time == 'Afternoon'
                        ? Color.icon
                        : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Evening}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      matchDetails?.match[0]?.time == 'Evening'
                        ? Color.icon
                        : Color.black,
                  },
                ]}
              />
              <Image
                source={IMAGES.Night}
                style={[
                  styles.icons,
                  {
                    tintColor:
                      matchDetails?.match[0]?.time == 'Night'
                        ? Color.icon
                        : Color.black,
                  },
                ]}
              />
            </View>
          </View>
        </View>
        <View style={[styles.subView]}>
          <Text style={styles.title}>
            Request Received{' '}
            <Text style={styles.subText}>
              {matchDetails?.pending_request +
                matchDetails?.acc_req +
                matchDetails?.rej_req}{' '}
              Requests
            </Text>
          </Text>
          <Text style={styles.title}>
            Info <Text style={styles.subText}>{matchDetails?.info}</Text>
          </Text>
          <Text style={styles.title}>
            Player{' '}
            <Text style={styles.subText}>
              {JSON.stringify(matchDetails?.co_player)}
            </Text>
          </Text>
        </View>
        <View style={[styles.subView]}>
          <View style={styles.iconTxtView}>
            <Text style={[styles.title, {paddingVertical: scale(0)}]}>
              PENDING
            </Text>
            <Text style={[styles.subText, {color: Color.icon}]}>
              ({matchDetails?.pending_request})
            </Text>
          </View>
          <View style={styles.iconTxtView}>
            <Text style={[styles.title, {paddingVertical: scale(0)}]}>
              APPROVED
            </Text>
            <Text style={[styles.subText, {color: Color.icon}]}>
              ({matchDetails?.acc_req})
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            refRBSheetPlayers.current.open();
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>MANAGE REQUESTS</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <ActivityLoader loading={Loader} />
      <RBSheet
        ref={refRBSheetPlayers}
        useNativeDriver={false}
        closeOnPressMask
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
            Requests
          </Text>
          <FlatList
            data={listOfRequest}
            renderItem={renderCoPlayers}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={{
              backgroundColor: Color.white,
              width: '100%',
              paddingHorizontal: scale(20),
              paddingTop: scale(5),
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

export default MatchDetailScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
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
  ReqName: {
    fontFamily: Fonts.bold,
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(3),
  },
  subBtnText: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    color: Color.white,
  },
  rejectBtn: {
    width: '49%',
    borderRadius: scale(5),
    backgroundColor: Color.red,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
  },
  acceptBtn: {
    width: '49%',
    borderRadius: scale(5),
    backgroundColor: Color.green,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
  },
  btnView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(5),
  },
  ReqPhone: {
    fontFamily: Fonts.regular,
    color: Color.black,
    fontSize: scale(14),
    paddingBottom: scale(3),
  },
  container: {
    padding: scale(20),
    backgroundColor: Color.background,
    flexGrow: 1,
  },
  contentCardView: {
    width: '75%',
  },
  imageCardView: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rbTitle: {
    fontFamily: Fonts.bold,
    fontSize: scale(18),
    color: Color.black,
    paddingBottom: scale(20),
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '90%',
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
    fontFamily: Fonts.bold,
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
  sportIcon: {
    height: scale(50),
    width: scale(50),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  statusView: {
    borderRadius: scale(5),
    textAlign: 'center',
    width: '50%',
    fontSize: scale(10),
    paddingVertical: scale(5),
    fontFamily: Fonts.bold,
    marginTop: scale(5),
  },
  matchName: {
    fontFamily: Fonts.bold,
    fontSize: scale(16),
    color: Color.black,
  },
  profile: {
    height: scale(50),
    width: scale(50),
    resizeMode: 'cover',
    borderRadius: scale(100),
  },
  name: {
    fontFamily: Fonts.regular,
    fontSize: scale(12),
    color: Color.black,
    paddingTop: scale(5),
  },
  profileView: {
    width: '30%',
    backgroundColor: Color.background,
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
  },
  icon: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
    tintColor: Color.grey,
  },
  iconTxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(10),
  },
  subText: {
    fontSize: scale(14),
    fontFamily: Fonts.regular,
    color: Color.black,
    paddingLeft: scale(10),
  },
  title: {
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    color: Color.black,
    paddingVertical: scale(5),
  },
  timeView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeView2: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    marginRight: scale(5),
  },
});
