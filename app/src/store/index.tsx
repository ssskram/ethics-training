import * as user from './user'
import * as types from './types'
import * as messages from './messages'

export interface ApplicationState {
    user: types.user,
    messages: types.messsage
}

export const reducers = {
    user: user.reducer,
    messages: messages.reducer
}

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}