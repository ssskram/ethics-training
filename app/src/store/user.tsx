
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.user = {
    user: '...loading',
    organization: '...loading',
    name: '...loading'
}

export const actionCreators = {
    loadUser: (): AppThunkAction<any> => async (dispatch) => {
        if (process.env.REACT_APP_ENV != 'dev') {
            const response = await fetch('/getUser', { credentials: 'same-origin' })
            const user = await response.json()
            dispatch({ type: constants.loadUser, user: user })
            return user
        } else {
            const user = { user: 'paul.marks@pittsburghpa.gov', organization: 'City of Pittsburgh', name: 'Marks, Paul' }
            dispatch({ type: constants.loadUser, user: user })
            return user
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