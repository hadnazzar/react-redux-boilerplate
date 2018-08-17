// @flow

import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux'
import AppRoutes from './AppRoutes'
import { PersistGate } from 'redux-persist/es/integration/react'
import configureStore from './store'

const { persistor, store } = configureStore()

const onBeforeLift = () => {
  // take some action before the gate lifts
}

type AppPropsType = { /* ... */ };
class App extends Component <AppPropsType> {
  // eslint-disable-next-line camelcase
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          // loading={<Loading />}
          onBeforeLift={onBeforeLift}
          persistor={persistor}>
          <AppRoutes />
        </PersistGate>
      </Provider>
    )
  }
}

export default App;
