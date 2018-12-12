
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.user = {
    user: ''
}

export const actionCreators = {
    loadUser: (): AppThunkAction<any> => (dispatch) => {
        if (process.env.REACT_APP_ENV != 'dev') {
            fetch('/getUser', { credentials: 'same-origin' })
                .then(response => {
                    response.json().then(data => {
                        dispatch({ type: constants.loadUser, user: data.user });
                    })
                })
        } else {
            dispatch({ type: constants.loadUser, user: 'paul.marks@pittsburghpa.gov' });
        }
    }
}

export const reducer: Reducer<types.user> = (state: types.user, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.loadUser:
            return { ...state, user: action.user }
    }
    return state || unloadedState
}