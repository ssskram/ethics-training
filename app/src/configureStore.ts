import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  Store,
  ReducersMapObject
} from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { ApplicationState, reducers } from "./store";
import { History } from "history";

export default function configureStore(
  history: History,
  initialState?: ApplicationState
) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, routerMiddleware(history))
  )(createStore);

  // combine all reducers and instantiate the store
  const allReducers = buildRootReducer(reducers);
  const store = createStoreWithMiddleware(allReducers, initialState) as Store<
    ApplicationState
  >;
  return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
  return combineReducers<ApplicationState>(Object.assign({}, reducers));
}
