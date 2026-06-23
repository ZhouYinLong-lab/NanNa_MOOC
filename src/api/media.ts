import request from './request'
import type { ApiResponse } from '@/types'

export function getMediaUrl(path: string) {
  // Return the full URL for media assets
  if (path.startsWith('http')) return path
  return `/api/media/${path}`
}

export function uploadFile(file: File, courseId?: string) {
  const formData = new FormData()
  formData.append('file', file)
  if (courseId) formData.append('courseId', courseId)
  return request.post<ApiResponse<{ url: string; fileSize: number; mimeType: string }>>('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function deleteMedia(mediaId: string) {
  return request.delete<ApiResponse<null>>(`/media/${mediaId}`)
}
