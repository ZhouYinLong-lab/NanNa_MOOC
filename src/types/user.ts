export type Role = 'admin' | 'teacher' | 'assistant' | 'student' | 'guest'

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  role: Role
  avatar?: string
  createdAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface TeacherApplication {
  id: string
  userId: string
  username: string
  displayName: string
  email: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
}
