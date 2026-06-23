import request from './request'
import type { ApiResponse, ContentNode, ContentResource } from '@/types'

export function getContentTree(courseId: string) {
  return request.get<ApiResponse<ContentNode[]>>(`/courses/${courseId}/content-tree`)
}

export function getContentNode(nodeId: string) {
  return request.get<ApiResponse<ContentNode>>(`/content-nodes/${nodeId}`)
}

export function createContentNode(data: Partial<ContentNode>) {
  return request.post<ApiResponse<ContentNode>>('/content-nodes', data)
}

export function updateContentNode(nodeId: string, data: Partial<ContentNode>) {
  return request.put<ApiResponse<ContentNode>>(`/content-nodes/${nodeId}`, data)
}

export function deleteContentNode(nodeId: string) {
  return request.delete<ApiResponse<null>>(`/content-nodes/${nodeId}`)
}

export function reorderContentNodes(courseId: string, nodeIds: string[]) {
  return request.put<ApiResponse<null>>(`/courses/${courseId}/content-tree/reorder`, { nodeIds })
}

export function getContentResource(nodeId: string) {
  return request.get<ApiResponse<ContentResource>>(`/content-nodes/${nodeId}/resource`)
}

export function saveContentResource(nodeId: string, data: Partial<ContentResource>) {
  return request.put<ApiResponse<ContentResource>>(`/content-nodes/${nodeId}/resource`, data)
}

export function uploadMedia(courseId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<ApiResponse<{ url: string }>>(`/courses/${courseId}/media/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
