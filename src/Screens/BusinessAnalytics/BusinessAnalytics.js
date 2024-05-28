import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';
import IMAGES from '../../Assets/Icons/index';
import {scale} from '../../utlis/Scale';
import Fonts from '../../Constants/Fonts';
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from 'react-native-gifted-charts';

const BusinessAnalytics = ({navigation}) => {
  const data = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];

  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Business Analytics'}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.master}>
        <BarChart data={data} />
        <LineChart data={data} />
        <PieChart data={data} />
        <PopulationPyramid
          data={[
            {left: 10, right: 12},
            {left: 9, right: 8},
          ]}
        />
        <BarChart data={data} horizontal />
        <LineChart data={data} areaChart />
        <PieChart data={data} donut />
      </ScrollView>
    </View>
  );
};

export default BusinessAnalytics;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
});
