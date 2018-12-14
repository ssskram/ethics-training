import * as user from './user'
import * as types from './types'
import * as messages from './messages'
import * as myCourses from './myCourses'

export interface ApplicationState {
    user: types.user,
    messages: types.messsage,
    myCourses: types.courses
}

export const reducers = {
    user: user.reducer,
    messages: messages.reducer,
    myCourses: myCourses.reducer
}

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}