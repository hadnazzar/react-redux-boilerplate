import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    USERNAME_CHANGED,
    CONFIRM_PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    CHANGE_AUTH_TYPE,
    // CHANGE_CAPTCHA,
    ACCOUNT_FETCH_SUCCESS,
    ACCOUNT_NAME_CHANGED,
    ACCOUNT_SURNAME_CHANGED,
    ACCOUNT_USERNAME_CHANGED,
    ACCOUNT_INSTITUTION_CHANGED,
    ACCOUNT_POSITION_CHANGED,
    ACCOUNT_UPDATE,
    ACCOUNTIMG_CHANGED,
    STATUS_CHANGED,
    SIGNOUT
  } from '../actions/types'
  
  const INITIAL_STATE = {
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    user: null,
    error: '',
    loading: false,
    failCount: 0,
    name: '',
    surname: '',
    institution: '',
    position: '',
    accountImg: '',
    status: ''
    // capctcha: false
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case STATUS_CHANGED:
      return { ...state, status: action.payload }
    case ACCOUNTIMG_CHANGED:
      return { ...state, accountImg: action.payload }
    case ACCOUNT_FETCH_SUCCESS:
      return { ...state, name: action.payload.name, surname: action.payload.surname, username: action.payload.username, email: action.payload.email, institution: action.payload.institution, position: action.payload.position, accountImg: action.payload.accountImg }
    case ACCOUNT_NAME_CHANGED:
      return { ...state, name: action.payload }
    case ACCOUNT_SURNAME_CHANGED:
      return { ...state, surname: action.payload }
    case ACCOUNT_USERNAME_CHANGED:
      return { ...state, username: action.payload }
    case EMAIL_CHANGED:
      return { ...state, email: action.payload }
    case ACCOUNT_INSTITUTION_CHANGED:
      return { ...state, institution: action.payload }
    case ACCOUNT_POSITION_CHANGED:
      return { ...state, position: action.payload }
    case ACCOUNT_UPDATE:
      return action.payload
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload }
    case USERNAME_CHANGED:
      return { ...state, username: action.payload }
    case CONFIRM_PASSWORD_CHANGED:
      return { ...state, confirmPassword: action.payload }
    case LOGIN_USER:
      return { ...state, loading: true, error: '' }
    case LOGIN_USER_SUCCESS:
      // return { ...state, user: action.payload, error: '', loading: false , email:'', password:'' };
      return { ...INITIAL_STATE, user: action.payload }
    case SIGNUP_USER:
      return { ...state, loading: true, error: '' }
    case SIGNUP_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload, error: `Signup Success. Please verify your email and login` }
    case LOGIN_USER_FAIL:
      return { ...state, error: `Authentication Failed. ${action.payload}`, password: '', loading: false, failCount: state.failCount + 1 }
    case SIGNUP_USER_FAIL:
      return { ...state, error: `Signup Failed. ${action.payload}`, password: '', confirmPassword: '', loading: false, failCount: state.failCount + 1 }
    case CHANGE_AUTH_TYPE:
      return { ...state, error: '', password: '', confirmPassword: '', loading: false }
    case SIGNOUT:
      return INITIAL_STATE
      // case CHANGE_CAPTCHA:
      //   return { ...state, capctcha: action.payload.capctcha };
    default:
      return state
    }
  }
  