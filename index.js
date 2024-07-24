/**
 * @format
 */

import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

Text.defaultProps = {maxFontSizeMultiplier: 1};
AppRegistry.registerComponent(appName, () => App);
