
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