
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.course = {
    started: '',
    complete: '',
    percentProgress: '',
    currentStage: '',
    grade: ''
}

export const actionCreators = {
    updateProgress: (load): AppThunkAction<any> => (dispatch) => {
        dispatch({ type: constants.updateProgress, courseProgress: load })
    }
}

export const reducer: Reducer<types.course> = (state: types.course, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.updateProgress:
            return { ...state, courseProgress: action.courseProgress }
    }
    return state || unloadedState
}