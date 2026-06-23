import request from './request'
import type { ApiResponse, ErrorBookItem, LearningProgress, QuestionItem, StudentProgressRecord } from '@/types'

export function getMyProgress(courseId: string) {
  return request.get<ApiResponse<LearningProgress>>(`/progress/${courseId}`)
}

export function markNodeCompleted(courseId: string, nodeId: string) {
  return request.post<ApiResponse<LearningProgress>>(`/progress/${courseId}/complete`, { nodeId })
}

export function markNodeIncomplete(courseId: string, nodeId: string) {
  return request.post<ApiResponse<LearningProgress>>(`/progress/${courseId}/uncomplete`, { nodeId })
}

export function getStudentProgress(courseId: string) {
  return request.get<ApiResponse<StudentProgressRecord[]>>(`/teacher/courses/${courseId}/student-progress`)
}

export function getQuestionBank(params?: { courseId?: string; type?: string; difficulty?: string; tags?: string; page?: number; pageSize?: number }) {
  return request.get<ApiResponse<{ items: QuestionItem[]; total: number }>>('/questions', { params })
}

export function createQuestion(data: Partial<QuestionItem>) {
  return request.post<ApiResponse<QuestionItem>>('/questions', data)
}

export function updateQuestion(id: string, data: Partial<QuestionItem>) {
  return request.put<ApiResponse<QuestionItem>>(`/questions/${id}`, data)
}

export function deleteQuestion(id: string) {
  return request.delete<ApiResponse<null>>(`/questions/${id}`)
}

export function getErrorBook(params?: { courseId?: string; page?: number; pageSize?: number }) {
  return request.get<ApiResponse<{ items: ErrorBookItem[]; total: number }>>('/error-book', { params })
}

export function addToErrorBook(questionId: string, wrongAnswer?: string | string[]) {
  return request.post<ApiResponse<null>>('/error-book', { questionId, wrongAnswer })
}

export function removeFromErrorBook(itemId: string) {
  return request.delete<ApiResponse<null>>(`/error-book/${itemId}`)
}

export function markErrorMastered(itemId: string) {
  return request.put<ApiResponse<null>>(`/error-book/${itemId}/mastered`)
}
