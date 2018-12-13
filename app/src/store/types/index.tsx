
// user
export interface user {
    user: string
}

// message
export interface messsage { 
    message: string
}

// courses
export interface courses {
    courses: course[]
}

// course
export interface course { 
    started: string
    complete: string
    percentProgress: string
    currentStage: string
    grade: string
}