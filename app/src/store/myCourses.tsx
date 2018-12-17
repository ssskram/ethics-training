
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.myCourses = {
    myCourses: []
}

export const actionCreators = {
    loadMyCourses: (user): AppThunkAction<any> => (dispatch) => {
        fetch("https://365proxy.azurewebsites.us/ethicstraining/courseHistory?user=" + user, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: constants.loadUsersCourses, courses: data })
            })
    },
    newCourse: (): AppThunkAction<any> => (dispatch) => {
        // build empty submission item here
        const newExam = {
            test: true,
            id: 1
        }
        fetch("https://365proxy.azurewebsites.us/ethicstraining/newCourse", {
            method: 'post',
            body: JSON.stringify(newExam),
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(res => res.json())
            .then(data => {
                newExam.id = data.id // or something like that to save generated course ID to store
                dispatch({ type: constants.newCourse, courses: newExam })
            })
        return newExam
    },
    updateCourseProgress: (body): AppThunkAction<any> => (dispatch) => {
        fetch("https://365proxy.azurewebsites.us/ethicstraining/updateCourse?id=" + body.courseID, {
            method: 'post',
            body: body,
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(() => {
                dispatch({ type: constants.updateCourse, courses: body })
            })

    }
}

export const reducer: Reducer<types.myCourses> = (state: types.myCourses, incomingAction: Action) => {
    const action = incomingAction as any
    switch (action.type) {
        case constants.loadUsersCourses:
            return { ...state, myCourses: action.courses }
        case constants.newCourse:
            return { ...state, myCourses: state.myCourses.concat(action.courses) }
        case constants.updateCourse:
            return {
                ...state,
                myCourses: state.myCourses.map(course => course.courseID === action.body.courseID ? {
                    ...course,
                    courseID: action.body.courseID,
                    started: action.body.started,
                    user: action.body.user,
                    email: action.body.email,
                    organization: action.body.organization,
                    completed: action.body.completed,
                    progress: action.body.progress,
                    module: action.body.module,
                    highPoint: action.body.highPoint
                } : course
                )
            };
    }
    return state || unloadedState
}