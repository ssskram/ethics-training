
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '.'
import * as constants from './constants'
import * as types from './types'

const unloadedState: types.myCourses = {
    myCourses: []
}

export const actionCreators = {
    loadMyCourses: (user): AppThunkAction<any> => (dispatch) => {
        fetch("http://localhost:3000/ethicstraining/courseHistory?user=" + user.user, {
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
    newCourse: (user: types.user): AppThunkAction<any> => async (dispatch) => {
        // generate new course record
        const forSP = {
            User: user.name,
            Email: user.user,
            Organization: user.organization,
            Progress: 0,
            HighPoint: 0,
            Completed: false,
        }
        const forStore: types.course = {
            user: user.name,
            email: user.user,
            organization: user.organization,
            completed: false,
            progress: 0,
            highPoint: 0,
            courseID: undefined,
            started: undefined
        }
        await fetch("http://localhost:3000/ethicstraining/newCourse", {
            method: 'post',
            body: JSON.stringify(forSP),
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(data => {
                forStore.courseID = data.id
                dispatch({ type: constants.newCourse, courses: forStore })
            })
        return forStore

    },
    updateCourseProgress: (course: types.course, forwardProgress: number): AppThunkAction<any> => (dispatch) => {
        const id = course.courseID
        if (forwardProgress == 100) {
            course.highPoint = 0
            course.progress = 100
            course.completed = true
        } else {
            course.highPoint = forwardProgress
            course.progress = (forwardProgress / 24)
        }
        // update course record
        const forSP = {
            User: course.user,
            Email: course.email,
            Organization: course.organization,
            Progress: course.progress,
            HighPoint: course.highPoint,
            Completed: course.completed,
        }
        const forStore: types.course = {            
            courseID: id,
            started: course.started,
            user: course.user,
            email: course.email,
            organization: course.organization,
            completed: course.completed,
            progress: course.progress,
            highPoint: course.highPoint
        }
        console.log(course)
        fetch("http://localhost:3000/ethicstraining/updateCourse?id=" + id, {
            method: 'post',
            body: JSON.stringify(forSP),
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API,
                'Content-Type': 'application/json'
            })
        })
            .then(() => {
                dispatch({ type: constants.updateCourse, courses: forStore })
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
                myCourses: state.myCourses.map(course => course.courseID === action.courseID ? {
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