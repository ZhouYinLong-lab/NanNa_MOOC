import request from './request'
import type { ApiResponse, Course, CourseOwnershipRecord, PaginatedData, PaginationParams } from '@/types'

export function getCourses(params?: PaginationParams & { keyword?: string; status?: string }) {
  return request.get<ApiResponse<PaginatedData<Course>>>('/courses', { params })
}

export function getCourseById(id: string) {
  return request.get<ApiResponse<Course>>(`/courses/${id}`)
}

export function createCourse(data: Partial<Course>) {
  return request.post<ApiResponse<Course>>('/courses', data)
}

export function updateCourse(id: string, data: Partial<Course>) {
  return request.put<ApiResponse<Course>>(`/courses/${id}`, data)
}

export function deleteCourse(id: string) {
  return request.delete<ApiResponse<null>>(`/courses/${id}`)
}

export function enrollCourse(courseId: string) {
  return request.post<ApiResponse<null>>(`/courses/${courseId}/enroll`)
}

export function unenrollCourse(courseId: string) {
  return request.post<ApiResponse<null>>(`/courses/${courseId}/unenroll`)
}

export function getMyCourses(params?: PaginationParams) {
  return request.get<ApiResponse<PaginatedData<Course>>>('/courses/my', { params })
}

export function transferCourseOwnership(courseId: string, toUserId: string) {
  return request.post<ApiResponse<null>>(`/courses/${courseId}/transfer`, { toUserId })
}

export function getOwnershipRecords(courseId: string) {
  return request.get<ApiResponse<CourseOwnershipRecord[]>>(`/courses/${courseId}/ownership-records`)
}

export function getTeachingCourses(params?: PaginationParams) {
  return request.get<ApiResponse<PaginatedData<Course>>>('/courses/teaching', { params })
}
