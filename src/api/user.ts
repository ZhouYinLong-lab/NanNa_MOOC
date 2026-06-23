import request from './request'
import type { ApiResponse, PaginatedData, TeacherApplication, User } from '@/types'

export function getUsers(params?: { page?: number; pageSize?: number; role?: string; keyword?: string }) {
  return request.get<ApiResponse<PaginatedData<User>>>('/admin/users', { params })
}

export function updateUserRole(userId: string, role: string) {
  return request.put<ApiResponse<User>>(`/admin/users/${userId}/role`, { role })
}

export function deleteUser(userId: string) {
  return request.delete<ApiResponse<null>>(`/admin/users/${userId}`)
}

export function getTeacherApplications(params?: { page?: number; pageSize?: number; status?: string }) {
  return request.get<ApiResponse<PaginatedData<TeacherApplication>>>('/admin/teacher-applications', { params })
}

export function approveTeacherApplication(applicationId: string, approved: boolean, reason?: string) {
  return request.put<ApiResponse<null>>(`/admin/teacher-applications/${applicationId}`, { approved, reason })
}

export function getTeachers(params?: { page?: number; pageSize?: number }) {
  return request.get<ApiResponse<PaginatedData<User>>>('/users/teachers', { params })
}
