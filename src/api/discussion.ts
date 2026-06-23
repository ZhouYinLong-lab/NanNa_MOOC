import request from './request'
import type { ApiResponse, CreatePostRequest, CreateReplyRequest, PaginatedData, Post, Reply } from '@/types'

export function getPosts(courseId: string, params?: { page?: number; pageSize?: number }) {
  return request.get<ApiResponse<PaginatedData<Post>>>(`/courses/${courseId}/posts`, { params })
}

export function getPostDetail(postId: string) {
  return request.get<ApiResponse<Post>>(`/posts/${postId}`)
}

export function createPost(data: CreatePostRequest) {
  return request.post<ApiResponse<Post>>('/posts', data)
}

export function updatePost(postId: string, data: { title?: string; content?: string }) {
  return request.put<ApiResponse<Post>>(`/posts/${postId}`, data)
}

export function deletePost(postId: string) {
  return request.delete<ApiResponse<null>>(`/posts/${postId}`)
}

export function pinPost(postId: string, pinned: boolean) {
  return request.put<ApiResponse<null>>(`/posts/${postId}/pin`, { pinned })
}

export function markPostAsAnswer(postId: string, isAnswer: boolean) {
  return request.put<ApiResponse<null>>(`/posts/${postId}/answer`, { isAnswer })
}

export function getReplies(postId: string) {
  return request.get<ApiResponse<Reply[]>>(`/posts/${postId}/replies`)
}

export function createReply(data: CreateReplyRequest) {
  return request.post<ApiResponse<Reply>>('/replies', data)
}

export function deleteReply(replyId: string) {
  return request.delete<ApiResponse<null>>(`/replies/${replyId}`)
}

export function markReplyAsAnswer(replyId: string, isAnswer: boolean) {
  return request.put<ApiResponse<null>>(`/replies/${replyId}/answer`, { isAnswer })
}
