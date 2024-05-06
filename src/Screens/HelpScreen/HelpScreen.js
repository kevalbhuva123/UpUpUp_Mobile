import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const HelpScreen = ({navigation}) => {
  const [data, setData] = useState([
    {
      id: 1,
      Que: 'What is Lorem ipsum?',
      Ans: 'Lorem ipsum is derived from the Latin dolorem ipsum roughly translated as pain itself.',
    },
    {
      id: 2,
      Que: 'What is Lorem ipsum?',
      Ans: 'Lorem ipsum is derived from the Latin dolorem ipsum roughly translated as pain itself.',
    },
    {
      id: 3,
      Que: 'What is Lorem ipsum?',
      Ans: 'Lorem ipsum is derived from the Latin dolorem ipsum roughly translated as pain itself.',
    },
    {
      id: 4,
      Que: 'What is Lorem ipsum?',
      Ans: 'Lorem ipsum is derived from the Latin dolorem ipsum roughly translated as pain itself.',
    },
    {
      id: 5,
      Que: 'What is Lorem ipsum?',
      Ans: 'Lorem ipsum is derived from the Latin dolorem ipsum roughly translated as pain itself.',
    },
  ]);

  const renderQuesList = ({item}) => {
    <View style={{padding: 10, backgroundColor: 'yellow'}}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.Que}</Text>
      <Text style={{fontSize: 16}}>{item.Ans}</Text>
    </View>;
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader heading={'Help'} onBackPress={() => navigation.goBack()} />
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
                    <Text style={styles.queText}>{item.Que}</Text>
                    <Text style={styles.ansText}>{item.Ans}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.loginBtn}>
          <Text style={styles.btnText}>CALL UP</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  logo: {
    height: scale(60),
    width: scale(90),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  headingText: {
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
    marginVertical: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 2,
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
    fontWeight: '600',
  },
  ansText: {
    fontSize: scale(14),
    color: Color.black,
    fontWeight: '400',
    paddingTop: scale(5),
  },
});
