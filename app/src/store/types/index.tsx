
// user
export interface user {
    user: string
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
    progress: string
    module: string
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