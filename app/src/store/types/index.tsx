
// user
export interface user {
    user: string
}

// message
export interface message {
    message: string
}

// courses
export interface courses {
    courses: course[]
}

// course
export interface course {
    courseID: string
    started: string
    user: string
    email: string
    organization: string
    completed: string
    progress: string
    module: string
    highPoint: string
}

// exam content
export interface examContent {
    id: number
    module: string
    question: string
    answers: string[]
    correct: string
    helper: string
}