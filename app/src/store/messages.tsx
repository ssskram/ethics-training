import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import * as constants from "./constants";
import * as types from "./types";

const unloadedState: types.message = {
  message: ""
};

export const actionCreators = {
  newMessage: (message): AppThunkAction<any> => dispatch => {
    dispatch({ type: constants.newMessage, message: message });
  },
  clearMessage: (): AppThunkAction<any> => dispatch => {
    dispatch({ type: constants.clearMessage });
  }
};

export const reducer: Reducer<types.message> = (
  state: types.message,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case constants.newMessage:
      return { ...state, message: action.message };
    case constants.clearMessage:
      return { ...state, message: "" };
  }
  return state || unloadedState;
};
