export interface LearningProgress {
  userId: string
  courseId: string
  completedNodes: string[]
  lastAccessedNode?: string
  lastAccessedAt?: string
  overallProgress: number
}

export interface StudentProgressRecord {
  userId: string
  userName: string
  courseId: string
  courseTitle: string
  completedNodes: string[]
  overallProgress: number
  lastAccessedAt?: string
}

export interface QuestionItem {
  id: string
  courseId?: string
  type: 'single' | 'multiple' | 'judge' | 'fill'
  question: string
  options?: string[]
  answer: string | string[]
  analysis?: string
  tags?: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ErrorBookItem {
  id: string
  userId: string
  questionId: string
  question: QuestionItem
  wrongAnswer?: string | string[]
  wrongCount: number
  lastWrongAt: string
  mastered: boolean
}
