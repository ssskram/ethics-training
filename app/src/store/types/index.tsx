
// user
export interface user {
    user: string
    organization: string
    name: string
}

// message
export interface message {
    message: string
}

// my courses
export interface myCourses {
    myCourses: course[]
}

// course record
export interface course {
    courseID: number
    started: string
    user: string
    email: string
    organization: string
    completed: boolean
    progress: number
    highPoint: number
}

// exam content
export interface examContent {
    questions: examQuestion[]
}

// exam question
export interface examQuestion {
    id: number
    module: string
    question: string
    answers: string[]
    correct: string
    helper: string
}