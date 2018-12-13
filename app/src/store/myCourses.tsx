
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.courses = {
    courses: []
}

export const actionCreators = {
    loadUsersCourses: (): AppThunkAction<any> => (dispatch) => {
        fetch('/getUsersCourses', { credentials: 'same-origin' })
        .then(response => {
            response.json().then(data => {
                dispatch({ type: constants.loadUsersCourses, courses: data })
            })
        })
    }
}

export const reducer: Reducer<types.courses> = (state: types.courses, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.loadUsersCourses:
            return { ...state, courses: action.courses }
    }
    return state || unloadedState
}