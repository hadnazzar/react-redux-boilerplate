import firebase from 'firebase'
import _ from 'lodash'
// Router Actions added
// import { Actions } from 'react-native-router-flux';
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
  CHANGE_CAPTCHA,
  FORGOT_PASSWORD_SUCCESS,
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
} from './types'

// For redirect
import history from '../history'

export const signOutUser = () => {
  firebase.auth().signOut().then(function () {
    history.push('/login')
    window.persistor.purge()
  }, function (error) {
    console.error('Sign Out Error', error)
  })
  return {
    type: SIGNOUT
  }
}

export const accountImgChanged = (img) => {
  return {
    type: ACCOUNTIMG_CHANGED,
    payload: img
  }
}

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  }
}

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  }
}
export const usernameChanged = (text) => {
  return {
    type: USERNAME_CHANGED,
    payload: text
  }
}
export const confirmPasswordChanged = (text) => {
  return {
    type: CONFIRM_PASSWORD_CHANGED,
    payload: text
  }
}

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER })

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        if (user.emailVerified) {
          loginUserSuccess(dispatch, user)
        } else {
          loginUserFail(dispatch, "User not verified.")
        }
      }
      )
      .catch((error) => {
        console.log("ERROR", error)
        loginUserFail(dispatch, error)
      })
  }
}

export const signupUser = ({ email, username, password, confirmPassword }) => {
  return (dispatch, getState) => {
    if (password !== confirmPassword) {
      signupUserFail(dispatch)
    } else {
      dispatch({ type: SIGNUP_USER })
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          signupUserSuccess(dispatch, user)

          user.updateProfile({
            displayName: username,
            photoURL: "www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png"
          }).then(function () {
            // Update successful.
          }).catch(function (error) {
            // An error happened.
            console.log(error)
          })

          user.sendEmailVerification().then(function () {
            // Email sent.
          }).catch(function (error) {
            // An error happened.
            console.log(error)
          })

          var updates = {}
          updates[`/users/${user.uid}/accountSettings/name`] = ""
          updates[`/users/${user.uid}/accountSettings/surname`] = ""
          updates[`/users/${user.uid}/accountSettings/username`] = username
          updates[`/users/${user.uid}/accountSettings/email`] = email
          updates[`/users/${user.uid}/accountSettings/accountImg`] = "www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png"
          updates[`/users/${user.uid}/accountSettings/institution`] = ""
          updates[`/users/${user.uid}/accountSettings/position`] = ""
          updates[`/users/${user.uid}/accountSettings/status`] = ""

          firebase.database().ref().update(updates)

          updates[`/onitNetwork/${user.uid}/name`] = ""
          updates[`/onitNetwork/${user.uid}/surname`] = ""
          updates[`/onitNetwork/${user.uid}/username`] = username
          updates[`/onitNetwork/${user.uid}/email`] = email
          updates[`/onitNetwork/${user.uid}/accountImg`] = "www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png"
          updates[`/onitNetwork/${user.uid}/institution`] = ""
          updates[`/onitNetwork/${user.uid}/position`] = ""
          updates[`/onitNetwork/${user.uid}/status`] = ""

          firebase.database().ref().update(updates)
        })
        .catch((error) => { signupUserFail(dispatch, error.message) })
    }
  }
}

export const forgotPassword = ({ email }) => {
  return (dispatch) => {
    var emailAddress = email
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
      forgotPasswordSuccess(dispatch, email)
    }).catch(function (error) {
      // An error happened.
      console.log(error)
    })
  }
}

export const changeAuthTab = () => {
  return {
    type: CHANGE_AUTH_TYPE
  }
}

export const changeCaptcha = (value) => {
  return {
    type: CHANGE_CAPTCHA,
    payload: value
  }
}

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  })
  // Router action function
  // Actions.main();
  history.push('/home')
}

export const changeUserStatus = () => {
  // const userListRef = firebase.database().ref("USERS_ONLINE");

  return (dispatch, getState) => {
    // const userRef = firebase.database().ref("USERS_ONLINE").push();
    const state = getState()
    const currentUser = state.auth.user
    const userId = currentUser.uid

    var amOnline = firebase.database().ref(`/.info/connected`)
    var userRef = firebase.database().ref(`/USERS_ONLINE/${userId}/online`)
    amOnline.on('value', snapshot => {
      if (snapshot.val()) {
        var timestamp = _.get(firebase, 'database.ServerValue.TIMESTAMP')
        userRef.onDisconnect().set(timestamp)
        userRef.set(true)
      }
    })
  }
}

const signupUserSuccess = (dispatch, user) => {
  dispatch({
    type: SIGNUP_USER_SUCCESS,
    payload: user
  })
  // Router action function
  // Actions.main();
  history.push('/login')
}

const loginUserFail = (dispatch, error) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: error
  })
}
const signupUserFail = (dispatch, error) => {
  dispatch({
    type: SIGNUP_USER_FAIL,
    payload: error
  })
}
const forgotPasswordSuccess = (dispatch, email) => {
  dispatch({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: email
  })
}

export const accountFetch = () => {
  return (dispatch, getState) => {
    const state = getState()
    const currentUser = state.auth.user
    firebase.database().ref(`/users/${currentUser.uid}/accountSettings`)
      .on('value', snapshot => {
        dispatch({ type: ACCOUNT_FETCH_SUCCESS, payload: snapshot.val() })
      })
  }
}

export const accountNameChanged = (text) => {
  return {
    type: ACCOUNT_NAME_CHANGED,
    payload: text
  }
}

export const accountSurnameChanged = (text) => {
  return {
    type: ACCOUNT_SURNAME_CHANGED,
    payload: text
  }
}

export const accountUsernameChanged = (text) => {
  return {
    type: ACCOUNT_USERNAME_CHANGED,
    payload: text
  }
}

export const accountInstitutionChanged = (text) => {
  return {
    type: ACCOUNT_INSTITUTION_CHANGED,
    payload: text
  }
}

export const accountPositionChanged = (text) => {
  return {
    type: ACCOUNT_POSITION_CHANGED,
    payload: text
  }
}

export const accountUpdate = ({ name, surname, username, email, institution, position, accountImg }) => {
  return (dispatch, getState) => {
    const state = getState()
    const currentUser = state.auth.user

    var updates = {}
    updates[`/users/${currentUser.uid}/accountSettings/name`] = name
    updates[`/users/${currentUser.uid}/accountSettings/surname`] = surname
    updates[`/users/${currentUser.uid}/accountSettings/username`] = username
    updates[`/users/${currentUser.uid}/accountSettings/email`] = email
    updates[`/users/${currentUser.uid}/accountSettings/institution`] = institution
    updates[`/users/${currentUser.uid}/accountSettings/position`] = position
    updates[`/users/${currentUser.uid}/accountSettings/accountImg`] = accountImg

    firebase.database().ref().update(updates)
      .then(() => {
        dispatch({ type: ACCOUNT_UPDATE })
        // redirect
      })
      .catch((error) => {
        console.log("ERROR", error)
      })

    var updates2 = {}
    updates2[`/onitNetwork/${currentUser.uid}/name`] = name
    updates2[`/onitNetwork/${currentUser.uid}/surname`] = surname
    updates2[`/onitNetwork/${currentUser.uid}/username`] = username
    updates2[`/onitNetwork/${currentUser.uid}/email`] = email
    updates2[`/onitNetwork/${currentUser.uid}/institution`] = institution
    updates2[`/onitNetwork/${currentUser.uid}/position`] = position
    updates2[`/onitNetwork/${currentUser.uid}/accountImg`] = accountImg
    firebase.database().ref().update(updates2)
  }
}

export const statusChanged = (status) => {
  return (dispatch, getState) => {
    const state = getState()
    const currentUser = state.auth.user

    var updates = {}
    updates[`/users/${currentUser.uid}/accountSettings/status`] = status

    firebase.database().ref().update(updates)
      .then(() => {
        dispatch({ type: STATUS_CHANGED, payload: status })
        // redirect
      })
      .catch((error) => {
        console.log("ERROR", error)
      })
  }
}
