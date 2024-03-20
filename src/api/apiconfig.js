import DeviceInfo from 'react-native-device-info';
import {Platform, Dimensions} from 'react-native';

/**
 * Error code found in app
 */
const errorCodes = {
  TIMEOUT: '111',
  NOTFOUNDCODE: 404,
  SERVERERRORCODE: 500,
  TOKENEXPIRECODE: 401,
  BLOCK_USER_CODE_BY_ADMIN: 403,
  LOWER_APP_VERSION_CODE: 304,
};

/**
 * api header related data
 */

const apiHeaderData = {
  android_app_version: DeviceInfo.getVersion()
    ? DeviceInfo.getVersion()
    : '1.0.0',
  device_type: Platform.OS == 'ios' ? '1' : '0',
  os: DeviceInfo.getSystemVersion(),
  ios_app_version: DeviceInfo.getVersion() ? DeviceInfo.getVersion() : '1.0.0',
  language: 'en',
  device_id: DeviceInfo.getUniqueId(),
  default_auth_token: '',
  refresh_token: '',
};

/**
 * all url used in app
 */
const apiUrl = {
  // Upsmart Api's
  LOCAL_SERVER_API_URL: '',
};

/**
 * api related configuration set
 */
const apiConfigs = {
  ...errorCodes,
  ...apiUrl,
  ...apiHeaderData,
};

export default apiConfigs;
