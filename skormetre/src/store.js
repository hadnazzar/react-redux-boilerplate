import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default: localStorage if web, AsyncStorage if react-native
import reducers from './reducers' // where reducers is an object of reducers

const config = {
  key: 'root',
  storage,
}

const reducer = persistCombineReducers(config, reducers)

function configureStore() {
  let store = createStore(reducer, {}, applyMiddleware(ReduxThunk))
  let persistor = persistStore(store)
  window.persistor = persistor
  return { persistor, store }
}

export default configureStore
