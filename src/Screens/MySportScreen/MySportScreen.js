import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import LinearGradient from 'react-native-linear-gradient';
import {Sports} from '../../Constants/StaticData';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const MySportScreen = ({navigation}) => {
  const [editEnable, setEditEnable] = useState(false);
  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    fetchSportsData();
  }, []);

  const fetchSportsData = () => {
    fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Sports/index`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.ErrorCode === 0) {
          const formattedData = data.Data.map(item => ({
            id: item.id,
            name: item.sports,
            image: {uri: item.image},
          }));
          setSportsData(formattedData);
        }
      })
      .catch(error => console.error('Error fetching sports data:', error));
  };

  const renderItem = ({item}) => {
    console.log('>>>>>>>>>>>>>>', (item?.image?.uri).replace(/\s+/g, ''));
    return (
      item.image && (
        <TouchableOpacity style={styles.item} disabled={!editEnable}>
          <View style={styles.closeView}>
            <Image source={IMAGES.Close} style={styles.closeIcon} />
          </View>
          <Image
            source={{uri: (item?.image?.uri).replace(/\s+/g, '')}}
            style={styles.sportIcon}
          />
          <Text style={styles.label}>{item.name}</Text>
        </TouchableOpacity>
      )
    );
  };

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'My Sports'}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.master}>
          <View style={styles.mainBox}>
            <View style={styles.headingBox}>
              <Text style={styles.headingText}>Favorite Sports</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditEnable(!editEnable);
                }}
                style={styles.editButton}>
                <Image source={IMAGES.Edit} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={sportsData}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={3}
              contentContainerStyle={{backgroundColor: Color.white}}
            />
            <TouchableOpacity style={styles.bottomButton}>
              <LinearGradient
                colors={[Color.main, Color.subBg]}
                style={styles.linearGradient}>
                <Image source={IMAGES.More} style={styles.more} />
                <Text style={styles.bottomText}>
                  CLICK HERE TO ADD MORE SPORTS
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MySportScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    padding: scale(15),
  },
  item: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    backgroundColor: Color.white,
    width: '33.3%',
  },
  label: {
    marginTop: scale(7),
    textAlign: 'center',
    fontFamily: Fonts.regular,
    color: Color.black,
    fontSize: scale(10),
  },
  sportIcon: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
  },
  closeIcon: {
    height: scale(15),
    width: scale(15),
    resizeMode: 'contain',
  },
  closeView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: scale(3),
  },
  mainBox: {
    width: '100%',
    elevation: 6,
  },
  headingBox: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    backgroundColor: Color.white,
    borderBottomColor: Color.lightGrey,
    borderBottomWidth: scale(1),
  },
  headingText: {
    fontSize: scale(16),
    color: Color.black,
    fontFamily: Fonts.bold,
  },
  editIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
  editButton: {
    height: scale(50),
    width: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    height: scale(150),
    width: '100%',
    marginTop: scale(20),
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  more: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
    marginBottom: scale(15),
  },
  bottomText: {
    fontSize: scale(14),
    color: Color.white,
    fontFamily: Fonts.bold,
  },
});
