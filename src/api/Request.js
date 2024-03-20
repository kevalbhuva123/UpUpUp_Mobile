import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import StorageService from "../utlis/StorageService";
import apiConfigs from "./apiconfig";
/**
 * api call module Request class
 */
export default class Request {
  /**
   * Header for Api calls
   */

  static getLanguage = async () => {
    let language = await StorageService.getItem(
      StorageService.STORAGE_KEYS.LANGUAGE
    );
    return language;
  };
  static getHeaders = async () => ({
    // 'Content-Type': 'application/json',
    // androidappversion: apiConfigs.android_app_version,
    // deviceid: apiConfigs.device_id,
    // devicetype: apiConfigs.device_type,
    // os: apiConfigs.os,
    // iosappversion: apiConfigs.ios_app_version,
    // language: await this.getLanguage(),
    Authorization: "Bearer" + " " + (await this.getToken()),
  });

  static getHeaderForRefreshToken = async () => ({
    Accept: "application/json",
    "Content-Type": "application/json",
    androidappversion: apiConfigs.android_app_version,
    deviceid: apiConfigs.device_id,
    devicetype: apiConfigs.device_type,
    os: apiConfigs.os,
    iosappversion: apiConfigs.ios_app_version,
    language: await this.getLanguage(),
    authtoken: await this.getToken(),
    refreshtoken: "",
  });

  /**Gets the User Auth token */
  static getToken = async () => {
    const authToken = await StorageService.getItem(
      StorageService.STORAGE_KEYS.AUTH_TOKEN
    );
    if (authToken) {
      return authToken;
    } else {
      return apiConfigs.default_auth_token;
    }
  };

  /**Sets the User Auth token */
  static setToken = async (token) => {
    return await StorageService.saveItem(
      StorageService.STORAGE_KEYS.AUTH_TOKEN,
      token
    );
  };

  /**Set the device token */
  static setDeviceToken = async (token) => {
    return await StorageService.saveItem(
      StorageService.STORAGE_KEYS.DEVICE_TOKEN,
      token
    );
  };

  /**Get the device token */
  static getDeviceToken = async () => {
    const deviceToken = await StorageService.getItem(
      StorageService.STORAGE_KEYS.DEVICE_TOKEN
    );
    return deviceToken;
  };

  /**
   * Check Internet Connectivity Status
   */
  static checkNetInfo = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
  };

  /**
   *
   * @param {*} promise
   * Time Out method
   */
  static timeOut = (promise) => {
    return new Promise((resolve, reject) => {
      const timerId = setTimeout(() => {
        reject({
          message: "timeoutMessage",
          status: apiConfigs.TIMEOUT,
          timerId,
        });
      }, 120 * 1000);
      promise.then(resolve, reject);
    });
  };

  /**action for update user auth token */
  static updateAuthToken = async (endpoint, params) => {
    const result = await Request.post("refreshToken");
    await this.setToken(result.data.new_token);
    return await this.buildRequest(endpoint, params);
  };

  /**
   *
   * @param {*} endpoint
   * @param {*} params
   * @param {*} options
   * Application related  Api request will be perform(Call) from here
   */
  static buildRequest = async (endpoint, params = {}, options = undefined) => {
    const headers =
      endpoint === "refreshToken"
        ? await this.getHeaderForRefreshToken()
        : await this.getHeaders();

    if ((await this.checkNetInfo()) === false) {
      // showToastMessage(translate('noInternetConnection'));
      // showSimpleAlert('No Internet Connection');
      return 500;
    }
    // if ((await this.checkNetInfo()) === false) {
    //   let NoInternet = 'No Internet';
    //   return NoInternet;
    // }

    try {
      const response = await this.timeOut(
        axios({
          url: `${apiConfigs.LOCAL_SERVER_API_URL}/${endpoint}`,
          headers,
          ...params,
        })
      );
      return this.checkValidatinoResponse(response, endpoint, params);
    } catch (error) {
      // Alert.alert(CONSTANTS.AppName, error);
      if (error) {
        /**
         * 111 TimeOut Error
         */
        if (error.status == apiConfigs.TIMEOUT) {
          // alert('Request time out');
          clearTimeout(error.timerId);
          return false;
        } else if (
          error.message == "Network Error" ||
          error.message == "Network error"
        ) {
          return false;
        } else {
          /**
           * Handle Unexpected errors
           */
          return error?.response?.status;
        }
      }
    }
  };

  /**
   *
   * @param {*} response
   * check validation of response return values
   */
  static checkValidatinoResponse = async (response, endpoint, params) => {
    // const navigation = useNavigation();
    const result = response;

    /**
     * 500 Server Error
     */
    if (result.code == apiConfigs.SERVERERRORCODE) {
      // alert('Server error message');
      return false;
    }

    /**
     * 404 Not Found Error
     */
    if (result.code == apiConfigs.NOTFOUNDCODE) {
      if (result.code == 0 && result.message) {
        // alert(result.message);
        // showSimpleAlert(result.message)
      }
    }

    /**
     * 401 Token Expire Error
     */
    if (result.code === apiConfigs.TOKENEXPIRECODE) {
      // navigation.navigate('Sign In');
    }

    /**
     * Handle lower app version for Update App.
     */
    if (result.code === apiConfigs.LOWER_APP_VERSION_CODE) {
      // navigation.navigate('Sign In');
    }

    return result;
  };

  /**
   *
   * @param {*} endpoint
   * @param {*} params
   * @param {*} options
   * GET method related api calls Start from here
   */
  static get = async (endpoint, params) =>
    this.buildRequest(endpoint, { method: "GET", data: params });

  /**
   *
   * @param {*} endpoint
   * @param {*} params
   * @param {*} options
   * POST method related api calls Start from here
   */
  static post = async (endpoint, params) =>
    this.buildRequest(endpoint, { method: "POST", data: params });
  /**
   *
   * @param {*} endpoint
   * @param {*} params
   * @param {*} options
   * PUT method related api calls Start from here
   */
  static put = (endpoint, params, options = undefined) =>
    this.buildRequest(endpoint, { method: "PUT", data: params }, options);
  /**
   *
   * @param {*} endpoint
   * @param {*} params
   * @param {*} options
   * PATCH method related api calls Start from here
   */
  static patch = async (endpoint, params) =>
    this.buildRequest(endpoint, { method: "PATCH", data: params });
  /**
   *
   * @param {*} endpoint
   * @param {*} params
   * @param {*} options
   * DELETE method related api calls Start from here
   */
  static deleteRequest = (endpoint, params = {}, options = undefined) =>
    this.buildRequest(endpoint, { method: "DELETE", data: params }, options);
}
