
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
    updateCourseProgress: (course, forwardProgress): AppThunkAction<any> => (dispatch) => {
        console.log('course = ' + course)
        console.log('forward progress = ' + forwardProgress)
        if (forwardProgress == 100) {
            course.highPoint == 0
            course.progress == 100
            course.completed == true
        } else {
            course.highpoint == forwardProgress
            course.progress == (forwardProgress/24) * 100
        }
        console.log('new course = ;' + course)
        fetch("https://365proxy.azurewebsites.us/ethicstraining/updateCourse?id=" + course.courseID, {
            method: 'post',
            body: JSON.stringify(course),
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
        })
            .then(() => {
                dispatch({ type: constants.updateCourse, courses: course })
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
                    courseID: action.courses.courseID,
                    started: action.courses.started,
                    user: action.courses.user,
                    email: action.courses.email,
                    organization: action.courses.organization,
                    completed: action.courses.completed,
                    progress: action.courses.progress,
                    highPoint: action.courses.highPoint
                } : course
                )
            };
    }
    return state || unloadedState
}