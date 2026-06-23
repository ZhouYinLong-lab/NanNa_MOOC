export type CourseStatus = 'draft' | 'published' | 'archived'
export type ContentNodeType = 'chapter' | 'section' | 'lesson' | 'resource'
export type ContentType = 'markdown' | 'video' | 'audio' | 'image' | 'attachment' | 'text' | 'latex'

export interface CourseSchedule {
  startDate?: string
  endDate?: string
  weeklyPlan?: string
}

export interface Course {
  id: string
  title: string
  description: string
  coverImage?: string
  ownerId: string
  ownerName: string
  status: CourseStatus
  semester?: string
  schedule?: CourseSchedule
  enrolledCount?: number
  createdAt: string
  updatedAt: string
}

export interface ContentResource {
  id: string
  nodeId: string
  contentType: ContentType
  content?: string
  mediaUrl?: string
  mediaMeta?: MediaMeta
}

export interface MediaMeta {
  duration?: number
  fileSize?: number
  mimeType?: string
  width?: number
  height?: number
}

export interface ContentNode {
  id: string
  courseId: string
  parentId: string | null
  title: string
  type: ContentNodeType
  order: number
  resource?: ContentResource
  children?: ContentNode[]
}

export interface CourseOwnershipRecord {
  id: string
  courseId: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  transferredAt: string
  transferredBy: string
}
