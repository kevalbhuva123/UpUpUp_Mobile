import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import {ActivityLoader} from '../../Components/Loader/Loader';

const HelpScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [helpLineNo, setHelpLineNo] = useState();

  useEffect(() => {
    getFAQList();
  }, []);

  const getFAQList = async () => {
    try {
      setLoader(true);

      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Help/faq`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setData(result?.Data?.faq);
          setHelpLineNo(result?.Data?.phone[0]?.phone);
          setLoader(false);

          console.log(result);
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

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader heading={'FAQ'} onBackPress={() => navigation.goBack()} />
      <View style={styles.master}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Frequently Asked Questions</Text>
          <Image source={IMAGES.LogoText} style={styles.logo} />
        </View>
        {/* <FlatList
          data={data}
          renderItem={item => {
            renderQuesList(item);
          }}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        /> */}
        <View style={{flex: 1}}>
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              paddingHorizontal: scale(20),
              paddingVertical: scale(20),
            }}
            showsVerticalScrollIndicator={false}>
            {data.map((item, index) => {
              return (
                <View style={styles.card}>
                  <Text style={styles.dot}>{'\u2B24'}</Text>
                  <View style={styles.subCard}>
                    <Text style={styles.queText}>{item?.question}</Text>
                    <Text style={styles.ansText}>{item?.answer}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${helpLineNo}`).catch(err =>
              console.error('Error:', err),
            );
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>CALL UP</Text>
        </TouchableOpacity>
      </View>
      <ActivityLoader loading={Loader} />
    </View>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
  heading: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
  },
  logo: {
    height: scale(60),
    width: scale(90),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  headingText: {
    fontSize: scale(16),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '80%',
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
    letterSpacing: 1,
    fontFamily: Fonts.bold,
  },
  card: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    marginBottom: scale(15),
    elevation: 6,
    backgroundColor: Color.background,
    borderRadius: scale(10),
    width: '100%',
    flexDirection: 'row',
  },
  dot: {
    color: Color.subBg,
  },
  subCard: {
    paddingLeft: scale(10),
  },
  queText: {
    fontSize: scale(14),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  ansText: {
    fontSize: scale(14),
    color: Color.black,
    paddingTop: scale(5),
    fontFamily: Fonts.regular,
  },
});
