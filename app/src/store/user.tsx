
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.user = {
    user: '',
    organization: '',
    name: ''
}

export const actionCreators = {
    loadUser: (): AppThunkAction<any> => (dispatch) => {
        if (process.env.REACT_APP_ENV != 'dev') {
            fetch('/getUser', { credentials: 'same-origin' })
                .then(response => {
                    response.json().then(data => {
                        console.log(data)
                        dispatch({ type: constants.loadUser, user: data });
                    })
                })
        } else {
            dispatch({ type: constants.loadUser, user: { user: 'paul.marks@pittsburghpa.gov', organization: 'City of Pittsburgh', name: 'Marks, Paul'} });
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