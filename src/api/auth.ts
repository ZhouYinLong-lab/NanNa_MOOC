import request from './request'
import type { ApiResponse, LoginRequest, LoginResponse, User } from '@/types'

export function login(data: LoginRequest) {
  return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function logout() {
  return request.post<ApiResponse<null>>('/auth/logout')
}

export function getCurrentUser() {
  return request.get<ApiResponse<User>>('/auth/me')
}

export function register(data: { username: string; password: string; email: string; displayName: string }) {
  return request.post<ApiResponse<User>>('/auth/register', data)
}

export function applyForTeacher(data: { reason: string }) {
  return request.post<ApiResponse<null>>('/auth/apply-teacher', data)
}
