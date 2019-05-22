import { API } from './instance'
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNIN_FAILURE,
  AUTH_USER,
  UN_AUTH_USER,
  // GET_USER_INFO,
  QUESTIONNAIRE_SUCCESS,
  QUESTIONNAIRE_FAILURE,
  PASSWORD_FORGOT_SUCCESS,
  PASSWORD_FORGOT_FAILURE,
} from './types/index'

import { push } from 'connected-react-router'
// import { LOCATION_CHANGE } from 'connected-react-router'
import axios from 'axios'
import { API_URL } from '../../config'
import Cookies from "js-cookie";

/*
 * Error helper
 */
export function authError(CONST, error) {
  return {
    type: CONST,
    payload: error,
  };
}

export function emailValidError(emailValidationInfo) {
  return {
    type: 'EMAIL_VALID',
    payload: emailValidationInfo,
  };
}

/*
 * Sign up
 */
export function signupUser(props) {
  const { firstName, accountName, email, password } = props;

  return function (dispatch) {
    API.post(`sign-up`, {
      'password': password,
      'email': email,
      'firstName': firstName,
      'accountName': accountName,
    })
      .then(response => {
        // console.log(response)

        if (response.data) {
          localStorage.setItem('token', JSON.stringify(response.data.token));
        }

        dispatch({ type: SIGNUP_SUCCESS });
        dispatch({ type: AUTH_USER });


        let params = new URLSearchParams(document.location.search);
        if (params.get('add-collaborations')) {
          dispatch(push(`/questionnaire?add-collaborations=${params.get('add-collaborations')}`));
        }
        else {
          dispatch(push('/questionnaire'));
        }

      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(SIGNUP_FAILURE, error.response.data.err.message))
        }
      });
  }
}

/*
 * Sign in
 */
export function signinUser(props) {
  const { email, password } = props;

  return function (dispatch, getState) {
    // let routerState = getState().router

    API.post(`sign-in`, {
      'email': email,
      'password': password
    })
      .then(response => {
        if (response.data) {
          localStorage.setItem('token', JSON.stringify(response.data.token));

          dispatch({ type: AUTH_USER });

          Cookies.set("userFirstName", response.data.firstName);
          Cookies.set("userID", response.data._id);

          console.log('signinUser action')


          let params = new URLSearchParams(document.location.search);
          if (params.get('add-collaborations')) {

            dispatch(push(params.get('add-collaborations')));

            // dispatch({
            //   type: LOCATION_CHANGE,
            //   payload: {
            //     location: {
            //       pathname: params.get('add-collaborations'),
            //       search: routerState.location.search,
            //       hash: routerState.location.hash
            //     },
            //     action: "PUSH"
            //   }
            // })

            console.log(params.get('add-collaborations'))
          }
          else {
            dispatch(push('/'));
          }

        }
      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(SIGNIN_FAILURE, error.response.data.message))
        }
      });
  }
}

export function validationUser(email) {
  return function (dispatch) {
    API.post(`email-validation`, {
      'email': email,
    })
      .then(res => res.json())
      .catch(function (error) {
        if (error.response) {
          dispatch(emailValidError(error.response.data.message))
        }
      });
  }
}

/*
 * Questionnaire
 */
export function questionnaireUser(props) {
  const {
    radioGroup,
    Name,
    Website,
  } = props;

  let obj = {};

  if (radioGroup === `Company`) {
    obj = {
      'companyName': Name,
      'companyWebsite': Website,
    }
  }

  if (radioGroup === `Agency`) {
    obj = {
      'agencyName': Name,
      'agencyWebsite': Website,
    }
  }

  if (radioGroup === `Freelancer`) {
    obj = {
      'Freelancer': radioGroup,
    }
  }

  if (radioGroup === `Other`) {
    obj = {
      'Other': radioGroup,
    }
  }

  return function (dispatch) {
    API.patch(`profile`, obj)
      .then(response => {
        localStorage.setItem('profile', JSON.stringify(response.data));
        // console.log(localStorage.getItem('profile'))
        dispatch({ type: QUESTIONNAIRE_SUCCESS });

        let params = new URLSearchParams(document.location.search);
        if (params.get('add-collaborations')) {
          let route = params.get('add-collaborations');
          dispatch(push(route));
        }
        else {
          dispatch(push('/'));
        }

      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(QUESTIONNAIRE_FAILURE, error.response.data.err.message))
        }
      });
  }
}

/*
 * password forgot
 */
export function passwordForgotUserStep1(data) {
  const {
    email,
  } = data;

  return function (dispatch) {
    API.post(`reset-password`, {
      'email': email,
    })
      .then(() => {
        dispatch(push('/password-forgot-step-2'));
      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(PASSWORD_FORGOT_FAILURE, error.response.data.err.message))
        }
      });
  }
}


export function passwordForgotUserStep3(data, token) {
  const {
    password,
  } = data;

  const postData = {
    'password': password
  };

  const axiosConfig = {
    headers: {
      'letter-confirm': token
    }
  };

  return function (dispatch) {
    axios.post(`${API_URL}/change-password`, postData, axiosConfig)
      .then(() => {
        dispatch({ type: PASSWORD_FORGOT_SUCCESS });
        dispatch(push('/sign-in'));
      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(PASSWORD_FORGOT_FAILURE, error.response.data.err.message))
        }
      });
  }
}

export function signoutUser() {
  return function (dispatch) {
    // API.get(`signOut`)
    //   .then(() => {
    localStorage.clear();
    dispatch({ type: UN_AUTH_USER });
    Cookies.remove("userFirstName");
    Cookies.remove("userID");
    // })
    // .catch(() => ("error signout"));
  }
}
