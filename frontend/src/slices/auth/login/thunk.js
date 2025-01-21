//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag, loginRequest } from './reducer';
import axios from 'axios';

export const loginUser = (user, history) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    
    const { data } = await axios.post('http://localhost:8000/api/v1/users/login', {
      username: user.username,
      password: user.password,
    });

    if (data.success && data.data) {
      localStorage.setItem("authUser", JSON.stringify(data.data));
      sessionStorage.setItem("authUser", JSON.stringify(data.data));
      // Store avatar from the nested user object
      if (data.data.user && data.data.user.avatar) {
        localStorage.setItem("avatar", data.data.user.avatar);
      }
      localStorage.setItem("token", data.data.accessToken);
      dispatch(loginSuccess(data));
      history('/admin-home');
    } else {
      dispatch(apiError(data));
    }
  } catch (error) {
    dispatch(apiError('email or password is not correct'));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    localStorage.removeItem("authUser");
    localStorage.removeItem("avatar");
    localStorage.removeItem("token");
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};