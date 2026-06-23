export interface Post {
  id: string
  courseId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  title: string
  content: string
  isPinned: boolean
  isAnswer: boolean
  replyCount: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface Reply {
  id: string
  postId: string
  parentReplyId: string | null
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  isAnswer: boolean
  createdAt: string
  children?: Reply[]
}

export interface CreatePostRequest {
  courseId: string
  title: string
  content: string
}

export interface CreateReplyRequest {
  postId: string
  parentReplyId?: string | null
  content: string
}
