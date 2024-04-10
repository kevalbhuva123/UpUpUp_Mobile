import React, { useState, useEffect } from 'react';
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
import { scale } from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';
import Fonts from '../../Constants/Fonts';
import apiConfigs from '../../api/apiconfig';

const MyAreaScreen = ({ navigation }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    fetch(`${apiConfigs.LOCAL_SERVER_API_URL}/Place/region`, {
      method: 'GET', // Assuming this endpoint supports GET method
      headers: {
        'Content-Type': 'application/json', // Change content type to application/json
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.ErrorCode === 0) {
          setOptions(data.Data.map(item => ({ id: item.id, label: item.location })));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const toggleOption = optionId => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedOptions.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.optionItem]}
        onPress={() => toggleOption(item.id)}>
        <Text style={styles.optionLabel}>{item.label}</Text>
        <Image
          source={isSelected ? IMAGES.Checked : IMAGES.Unchecked}
          style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <CustomHeader
        heading={'My Areas'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Text style={styles.headingText}>Choose Area/Place</Text>
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
            navigation.navigate('LoginInfoScreen');
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>FINISH</Text>
        </TouchableOpacity>
      </View>
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
  optionItem: {
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(15),
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
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  unCheckedIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
  },
});
